import { readFileSync, writeFileSync, existsSync } from "fs";
import { initAuthCreds, BufferJSON, proto } from "@whiskeysockets/baileys";

const KEY_MAP = {
  "pre-key": "preKeys",
  session: "sessions",
  "sender-key": "senderKeys",
  "app-state-sync-key": "appStateSyncKeys",
  "app-state-sync-version": "appStateVersions",
  "sender-key-memory": "senderKeyMemory",
};

function useSingleFileAuthState(filename) {
  let creds,
    keys = {},
    saveCount = 0;

  const saveState = (forceSave) => {
    saveCount++;
    if (forceSave || saveCount > 5) {
      writeFileSync(
        filename,
        JSON.stringify({ creds, keys }, BufferJSON.replacer, 2)
      );
      saveCount = 0;
    }
  };

  if (existsSync(filename)) {
    const result = JSON.parse(
      readFileSync(filename, { encoding: "utf-8" }),
      BufferJSON.reviver
    );
    creds = result.creds;
    keys = result.keys || {};
    for (const key of Object.values(KEY_MAP)) {
      keys[key] = keys[key] || {};
    }
  } else {
    creds = initAuthCreds();
    for (const key of Object.values(KEY_MAP)) {
      keys[key] = {};
    }
  }

  return {
    state: {
      creds,
      keys: {
        get: (type, ids) => {
          const key = KEY_MAP[type];
          return ids.reduce((dict, id) => {
            let value = keys[key]?.[id];
            if (value) {
              if (type === "app-state-sync-key") {
                value = proto.AppStateSyncKeyData.fromObject(value);
              }
              dict[id] = value;
            }
            return dict;
          }, {});
        },
        set: (data) => {
          for (const _key in data) {
            const key = KEY_MAP[_key];
            keys[key] = keys[key] || {};
            Object.assign(keys[key], data[_key]);
          }
          saveState();
        },
      },
    },
    saveState,
  };
}

export default useSingleFileAuthState;
