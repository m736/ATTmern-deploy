import React, { useState } from "react";
import {
  BsArrowLeftShort,
  BsBuildingAdd,
  BsChatRightDots,
  BsChevronDown,
  BsFillEyeFill,
  BsSearch,
  BsTable,
  BsUpload,
} from "react-icons/bs";
import { FaTruckMoving } from "react-icons/fa";
import { AiFillCar } from "react-icons/ai";
import { RiDashboardFill } from "react-icons/ri";
import { NavLink } from "react-router-dom";
const NavBar = () => {
  const [open, setOpen] = useState(true);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  let Menus = [
    {
      title: "MIS Details",
      icon: <FaTruckMoving />,
      submenu: true,
      name: "mis",

      submenuItems: [
        { title: "MISUpload", icon: <BsUpload />, href: "/" },
        { title: "MISTableData", icon: <BsTable />, href: "/tabledata" },
      ],
    },
    {
      title: "Vehicle",
      icon: <BsChatRightDots />,
      submenu: true,
      name: "vehicle",
      spacing: "true",
      submenuItems: [
        { title: "AddVehicle", icon: <BsBuildingAdd />, href: "/add_vechicle" },
        {
          title: "VehicleList",
          href: "/vehicle_list",
          icon: <BsFillEyeFill />,
        },
      ],
    },
    {
      title: "Tarrif",
      icon: <BsChatRightDots />,
      submenu: true,
      name: "tarrif",
      spacing: "true",
      submenuItems: [
        {
          title: "AddTarrif",
          icon: <BsBuildingAdd />,
          href: "/tarrif/new_tarrif",
        },
        {
          title: "TarrifList",
          icon: <BsBuildingAdd />,
          href: "/tarrif/tarrif_list",
        },
      ],
    },
  ];
  const [menuOption, setMenuOption] = useState(Menus);

  return (
    <>
      <div
        className={`bg-dark-blue h-screen p-5 pt-8 ${
          open ? "" : "w-20"
        } duration-300 relative`}
      >
        <BsArrowLeftShort
          className={`bg-white text-dark-blue text-3xl rounded-full absolute -right-3 top-9 border border-dark-blue cursor-pointer ${
            !open && "rotate-180"
          }`}
          onClick={() => setOpen(!open)}
        />
        <div className="inline-flex">
          <AiFillCar
            className={`bg-amber-300 text-4xl rounded cursor-pointer block float-left mr-2 duration-500 ${
              open && "rotate-[360deg]"
            }`}
          />
          <h1
            className={`text-white origin-left font-medium text-2xl duration-300 ${
              !open && "scale-0"
            }`}
          >
            {" "}
            ATT
          </h1>
        </div>
        <div
          className={`flex items-center rounded-md bg-light_white
          mt-6 ${!open ? "px-2" : "px-4"} py-2`}
        >
          <BsSearch
            className={`text-white text-lg block float-left cursor-pointer ${
              open && "mr-2"
            }`}
          />
          <input
            type={"search"}
            placeholder="Search"
            className={`text-base bg-transparent w-full text-white focus:outline-none ${
              !open && "hidden"
            }`}
          />
        </div>
        <ul className={`pt-2`}>
          {menuOption.map((menu, index) => (
            <>
              <li
                key={index}
                className={`text-gray-300 text-sm flex 
                items-center gap-x-4 
                cursor-pointer p-2 hover:bg-light_white 
                rounded-md ${menu.spacing ? "mt-9" : "mt-2"}`}
              >
                <span className="text-2xl block float-left">
                  {menu.icon ? menu.icon : <RiDashboardFill />}
                </span>
                <span
                  className={`text-base font-medium flex-1 duration-200 ${
                    !open && "hidden"
                  }`}
                >
                  {menu.href ? (
                    <NavLink to={`${menu.href}`}> {menu.title}</NavLink>
                  ) : (
                    menu.title
                  )}
                </span>
                {open && (
                  <BsChevronDown
                    className={`${menu.submenu && "rotate-180"}`}
                    onClick={() => {
                      let menulist = [...menuOption];
                      menulist[index].submenu = !menulist[index].submenu;
                      setMenuOption(menulist);
                    }}
                  />
                )}
              </li>
              {menu.submenu && open && (
                <ul>
                  {menu.submenuItems.map((submenuItem, index) => (
                    <li
                      key={index}
                      className="text-gray-300 text-sm flex 
                     items-center gap-x-4 
                     cursor-pointer p-2 hover:bg-light_white 
                     rounded-md mt-2 ml-5"
                    >
                      <span className="text-xl block float-left">
                        {submenuItem.icon ? (
                          submenuItem.icon
                        ) : (
                          <RiDashboardFill />
                        )}
                      </span>
                      <NavLink to={`${submenuItem.href}`}>
                        {" "}
                        {submenuItem.title}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ))}
        </ul>
      </div>
    </>
  );
};

export default NavBar;
