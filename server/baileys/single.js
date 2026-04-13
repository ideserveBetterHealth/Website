import { readFileSync, writeFileSync, existsSync } from "fs";
import { initAuthCreds, BufferJSON, proto } from "@whiskeysockets/baileys";

const LEGACY_KEY_MAP = {
  "pre-key": "preKeys",
  session: "sessions",
  "sender-key": "senderKeys",
  "app-state-sync-key": "appStateSyncKeys",
  "app-state-sync-version": "appStateVersions",
  "sender-key-memory": "senderKeyMemory",
};

const KEY_TYPES = [
  "pre-key",
  "session",
  "sender-key",
  "app-state-sync-key",
  "app-state-sync-version",
  "sender-key-memory",
  "lid-mapping",
  "device-list",
  "tctoken",
];

function normalizeDeviceList(value) {
  if (!value) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => String(item));
  }

  if (typeof value === "string") {
    return [value];
  }

  if (typeof value === "object") {
    return Object.values(value).map((item) => String(item));
  }

  return value;
}

function buildKeysStore(rawKeys = {}) {
  const keys = {};

  for (const type of KEY_TYPES) {
    keys[type] = rawKeys[type] || rawKeys[LEGACY_KEY_MAP[type]] || {};
  }

  return keys;
}

function useSingleFileAuthState(filename) {
  let creds,
    keys = {},
    saveCount = 0;

  const saveState = (forceSave) => {
    saveCount++;
    if (forceSave || saveCount > 5) {
      writeFileSync(
        filename,
        JSON.stringify({ creds, keys }, BufferJSON.replacer, 2),
      );
      saveCount = 0;
    }
  };

  if (existsSync(filename)) {
    const result = JSON.parse(
      readFileSync(filename, { encoding: "utf-8" }),
      BufferJSON.reviver,
    );
    creds = result.creds;
    keys = buildKeysStore(result.keys || {});
  } else {
    creds = initAuthCreds();
    keys = buildKeysStore({});
  }

  return {
    state: {
      creds,
      keys: {
        get: (type, ids) => {
          return ids.reduce((dict, id) => {
            const bucket = keys[type] || keys[LEGACY_KEY_MAP[type]] || {};
            let value = bucket[id];

            if (value) {
              if (type === "app-state-sync-key") {
                value = proto.Message.AppStateSyncKeyData.fromObject(value);
              }

              if (type === "device-list") {
                value = normalizeDeviceList(value);
              }

              dict[id] = value;
            }
            return dict;
          }, {});
        },
        set: (data) => {
          for (const _key in data) {
            keys[_key] = keys[_key] || {};

            const nextValues = data[_key] || {};
            if (_key === "device-list") {
              for (const id in nextValues) {
                const value = nextValues[id];
                nextValues[id] = value ? normalizeDeviceList(value) : value;
              }
            }

            Object.assign(keys[_key], nextValues);
          }
          saveState();
        },
      },
    },
    saveState,
  };
}

export default useSingleFileAuthState;
