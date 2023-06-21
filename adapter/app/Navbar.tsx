const navItems = [
  { name: "Home", path: "/" },
  { name: "Register", path: "/register" },
  { name: "Dashboard", path: "/dashboard" },
  { name: "My Devices", path: "/sbt" },
  { name: "Sync Data", path: "/syncdata" },
  { name: "Collect", path: "/rewards" },
];

export const Navbar = () => {
  return (
    <nav className="flex items-center  flex-wrap bg-transparent p-6">
      {navItems.map((item) => (
        <div
          key={item.name}
          className="flex items-center flex-shrink-0 text-white text-opacity-50 mr-6"
        >
          <a href={item.path}>
            <span className="font-semibold text-xl tracking-tight">
              {item.name}
            </span>
          </a>
        </div>
      ))}
    </nav>
  );
};
