import { Button } from "@/components/ui/button";
import { useRouteError } from "react-router-dom";

import { Link } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-2">Oops!</h1>
      <h2 className="text-2xl font-medium mb-4">Something went wrong</h2>
      <p className="text-gray-600 mb-6">
        {error?.statusText || error?.message || "An unexpected error occurred"}
      </p>
      <Link to="/">
        <Button>Back to Dashboard</Button>
      </Link>
    </div>
  );
}
