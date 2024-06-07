import React, { useState } from "react";
import { BsArrowLeftShort, BsChevronDown, BsSearch } from "react-icons/bs";

import { AiFillCar } from "react-icons/ai";

import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
const NavBar = () => {
  const [open, setOpen] = useState(true);
  const { isAuthenticated, user } = useSelector((state) => state.authState);
  let Menus = [
    {
      title: "Master",
      submenu: true,
      name: "client",
      spacing: "true",
      role: ["user", "admin"],
      submenuItems: [
        {
          title: "New Client Master",
          href: "/client_master/new_client_master",
          role: ["user", "admin"],
        },
        {
          title: "List Client Master",
          href: "/client_master/list_client_master",
          role: ["user", "admin"],
        },
        {
          title: "Create Area",
          href: "/client_master/create_area",
          role: ["user", "admin"],
        },
        {
          title: "List Area",
          href: "/client_master/list_area",
          role: ["user", "admin"],
        },
        {
          title: "Create Vehicle Type",
          href: "/client_master/create_vehicle_type",
          role: ["user", "admin"],
        },
        {
          title: "List Vehicle Type",
          href: "/client_master/vehicle_type_list",
          role: ["user", "admin"],
        },
      ],
    },
    {
      title: "Owners",
      submenu: true,
      name: "owners",
      spacing: "true",
      role: ["admin"],
      submenuItems: [
        {
          title: "New Owner",
          href: "/owners/new_owner",
          role: ["admin"],
        },
        {
          title: "Owners List",
          href: "/owners/list_owner",
          role: ["admin"],
        },
        {
          title: "Vehicle Owners List",
          href: "/owners/vehicle_with_owner",
          role: ["admin"],
        },
      ],
    },
    {
      title: "Agencies",
      submenu: true,
      name: "agencies",
      spacing: "true",
      role: ["admin"],
      submenuItems: [
        {
          title: "New Agency",
          href: "/agencies/new_agency",
          role: ["admin"],
        },
        {
          title: "Agency List",
          href: "/agencies/list_agencies",
          role: ["admin"],
        },
      ],
    },
    {
      title: "Drivers",
      submenu: true,
      name: "drivers",
      spacing: "true",
      role: ["admin"],
      submenuItems: [
        {
          title: "New Driver",
          href: "/driver/new_driver",
          role: ["admin"],
        },
        {
          title: "Driver List",
          href: "/driver/list_driver",
          role: ["admin"],
        },
      ],
    },
    {
      title: "Vehicles",
      submenu: true,
      name: "vehicles",
      spacing: "true",
      role: ["admin"],
      submenuItems: [
        {
          title: "New Vehicle",
          href: "/vehicle/new_vehicle",
          role: ["admin"],
        },
        {
          title: "Vehicle List",
          href: "/vehicle/vehicle_list",
          role: ["admin"],
        },
      ],
    },

    {
      title: "Tarrif",
      role: ["user", "admin"],
      submenu: true,
      name: "tarrif",
      spacing: "true",
      submenuItems: [
        {
          title: "AddTarrif",
          href: "/tarrif/new_tarrif",
          role: ["user", "admin"],
        },
        // {
        //   title: "TarrifExcelUpload",

        //   href: "/tarrif/upload_tarrif",
        // },
        {
          title: "TarrifList",
          href: "/tarrif/tarrif_list",
          role: ["user", "admin"],
        },
      ],
    },

    {
      title: "Client MIS",
      role: ["user", "admin"],
      submenu: true,
      name: "mis",
      spacing: "true",
      submenuItems: [
        {
          title: "Client MIS Upload",
          role: ["user", "admin"],
          href: "/mis/upload_mis",
        },
        {
          title: "Client MIS Download",
          role: ["user", "admin"],
          href: "/mis/download_mis",
        },
        {
          title: "Delete Client Mis Data",
          href: "/mis/delete_client_mis",
          role: ["admin"],
        },
      ],
    },
    {
      title: "Site MIS",
      role: ["user", "admin", "sitemanager"],

      submenu: true,
      name: "site_data_mis",
      spacing: "true",
      submenuItems: [
        {
          title: "Site MIS Upload",
          role: ["user", "admin", "sitemanager"],
          href: "/site_data_mis/site_upload_mis",
        },
        {
          title: "Site MIS Download",
          role: ["user", "admin", "sitemanager"],
          href: "/site_data_mis/site_download_mis",
        },
        {
          title: "Delete Site Mis",
          role: ["user", "admin"],
          href: "/site_data_mis/delete_site_mis",
        },
      ],
    },
    {
      title: "Invoice",
      submenu: true,
      role: ["admin"],
      name: "invoice",
      spacing: "true",
      submenuItems: [
        {
          title: "Updated Invoice Number",
          href: "/invoice/invoice_no",
          role: ["admin"],
        },
        {
          title: "Invoice Generate",
          href: "/invoice/invoice_generate",
          role: ["admin"],
        },

        {
          title: "Merge Invoice Generate",
          href: "/invoice/merge_invoice_generate",
          role: ["admin"],
        },
        {
          title: "Invoice List",
          href: "/invoice/invoice_list",
          role: ["admin"],
        },
      ],
    },
    {
      title: "Purchase Memo",
      submenu: true,
      role: ["admin"],
      name: "purchase_memo",
      spacing: "true",
      submenuItems: [
        {
          title: "Create Purchase_Memo",
          href: "/purchase_memo/create_purchase_memo",
          role: ["admin"],
        },
        {
          title: "PurchaseMemo List",
          href: "/purchase_memo/list_purchase_memo",
          role: ["admin"],
        },
      ],
    },
  ];
  const [menuOption, setMenuOption] = useState(Menus);
  const ex = menuOption.map((item) => {
    return item.submenuItems.map((submenu) => {
      console.log(submenu);
      return submenu?.role == user?.role;
    });
  });
  console.log(ex);

  return (
    <>
      <div
        className={`bg-dark-blue h-full min-h-screen p-5 pt-8 ${
          open ? "" : "w-20"
        } duration-300 relative`}
      >
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
          {menuOption.map(
            (menu, index) =>
              menu?.role.includes(user?.role) && (
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
                  {!menu.submenu && open && (
                    <ul>
                      {menu.submenuItems?.map((submenuItem, index) =>
                        submenuItem?.role.includes(user?.role) ? (
                          <>
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
                          </>
                        ) : null
                      )}
                    </ul>
                  )}
                </div>
              )
          )}
        </ul>
      </div>
    </>
  );
};

export default NavBar;
