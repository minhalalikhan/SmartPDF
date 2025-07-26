import { Link } from "react-router";

type Props = {};

function PageNotFound({}: Props) {
  return (
    <div className="w-full h-full flex items-center justify-center gap-7 flex-col">
      <h1 className="text-gray-400">404 - Page Not Found </h1>
      <p className="text-gray-500">
        The page you are looking for does not exist.
      </p>
      <p className="text-gray-500">
        Please check the URL or return to the homepage.
      </p>

      <Link
        to={"/"}
        className="rounded-4xl px-3 py-1.5 cursor-pointer bg-zinc-900 text-zinc-400"
      >
        Homepage
      </Link>
    </div>
  );
}

export default PageNotFound;
