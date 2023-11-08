import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { BsChevronDown } from "react-icons/bs";
const NavBar = () => {
  let Menus = [
    {
      title: "Master",
      submenu: true,
      name: "client",
      spacing: "true",
      submenuItems: [
        {
          title: "New Client Master",
          href: "/client_master/new_client_master",
        },
        {
          title: "List Client Master",
          href: "/client_master/list_client_master",
        },
        {
          title: "Create Area",
          href: "/client_master/create_area",
        },
        {
          title: "List Area",
          href: "/client_master/list_area",
        },
        {
          title: "Create Vehicle Type",
          href: "/client_master/create_vehicle_type",
        },
        {
          title: "List Vehicle Type",
          href: "/client_master/vehicle_type_list",
        },
      ],
    },
    {
      title: "Tarrif",
      submenu: true,
      name: "tarrif",
      spacing: "true",
      submenuItems: [
        {
          title: "AddTarrif",
          href: "/tarrif/new_tarrif",
        },
        // {
        //   title: "TarrifExcelUpload",

        //   href: "/tarrif/upload_tarrif",
        // },
        {
          title: "TarrifList",
          href: "/tarrif/tarrif_list",
        },
      ],
    },
    {
      title: "MIS",
      // icon: <BsChatRightDots />,
      submenu: true,
      name: "mis",
      spacing: "true",
      submenuItems: [
        // {
        //   title: "OnCall MIS Upload",

        //   href: "/mis/oncall_mis_upload",
        // },
        {
          title: "MIS Upload",

          href: "/mis/upload_mis",
        },
        {
          title: "MIS Download",

          href: "/mis/download_mis",
        },
        // {
        //   title: "TripBase MIS Upload",

        //   href: "/mis/trip_mis_upload",
        // },
        // {
        //   title: "DayBase MIS Upload",

        //   href: "/mis/day_mis_upload",
        // },
        // {
        //   title: "DownloadOnCall MIS",

        //   href: "/mis/download_onCall_mis",
        // },
        // {
        //   title: "DownloadSlabBase MIS",

        //   href: "/mis/download_slabBase_mis",
        // },
        // {
        //   title: "DownloadTripBase MIS",

        //   href: "/mis/download_tripBase_mis",
        // },
        // {
        //   title: "DownloadDayBase MIS",

        //   href: "/mis/download_dayBase_mis",
        // },
      ],
    },
    {
      title: "Invoice",
      submenu: true,
      name: "invoice",
      spacing: "true",
      submenuItems: [
        {
          title: "Manual Invoice",
          href: "/invoice/manual_invoice",
        },
        {
          title: "Invoice Generate",
          href: "/invoice/invoice_generate",
        },
      ],
    },
  ];
  const [menuOption, setMenuOption] = useState(Menus);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  return (
    <>
      <div className={`bg-dark-blue h-full min-h-screen p-5 pt-8 relative`}>
        <ul className={`pt-2`}>
          {menuOption.map((menu, index) => (
            <div key={menu.title}>
              <li
                key={index}
                className={`text-gray-300 text-sm flex 
                items-center gap-x-4 
                cursor-pointer p-2 hover:bg-light_white 
                rounded-md ${menu.spacing ? "mt-9" : "mt-2"}`}
              >
                <span className="text-2xl block float-left">
                  {menu.icon ? menu.icon : null}
                </span>
                <span className={`text-base font-medium flex-1 duration-200 `}>
                  {menu.href ? (
                    <NavLink to={`${menu.href}`}> {menu.title}</NavLink>
                  ) : (
                    menu.title
                  )}
                </span>
                <BsChevronDown
                  onClick={() => {
                    let menulist = [...menuOption];
                    menulist[index].submenu = !menulist[index].submenu;
                    setIsSubMenuOpen((s) => !s);
                    setMenuOption(menulist);
                  }}
                />
              </li>
              {isSubMenuOpen && (
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
                        {submenuItem.icon ? submenuItem.icon : null}
                      </span>
                      <NavLink to={`${submenuItem.href}`}>
                        {" "}
                        {submenuItem.title}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </ul>
      </div>
    </>
  );
};

export default NavBar;
