import Link from "next/link";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Register", path: "/register" },
  { name: "My Devices", path: "/sbt" },
  { name: "Sync Data", path: "/syncdata" },
  { name: "Collect", path: "/rewards" },
];

export const Navbar = () => {
  return (
    <nav className="flex items-center flex-wrap gap-4 bg-transparent p-6">
      {navItems.map((item) => (
        <NavItem name={item.name} path={item.path} key={item.path} />
      ))}
    </nav>
  );
};

const NavItem = ({ name, path }: { name: string; path: string }) => {
  return (
    <div className="group">
      <Link
        href={path}
        className="text-neutral-400 transition-colors duration-300 group-hover:text-primary-50"
      >
        <span className="text-xl tracking-tight">{name}</span>
      </Link>
      <div className="mx-2 mt-2 duration-300 border-b-2 opacity-0 border-white group-hover:opacity-50"></div>
    </div>
  );
};
