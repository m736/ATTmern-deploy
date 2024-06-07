import React, { useEffect, useState } from "react";
import { Routes, Route, HashRouter, BrowserRouter } from "react-router-dom";
import "./App.css";
// import ExcelUpload from "./Component/ExcelUpload";
import NavBar from "./Component/NavBar";
// import FormSelect from "./Component/FormSelect";
// import { useDispatch } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
// import {
//   vechicleFail,
//   vechicleRequest,
//   vechicleSuccess,
// } from "./slices/VechicleDetailSlice";
// import axios from "axios";
import VehicleList from "./Vehicle/VehicleList";
import AddVehicleList from "./Vehicle/AddVehicleList";
import { ToastContainer } from "react-toastify";
import { CreateNewTarrif } from "./Tarrif/CreateNewTarrif";
import ReadUpdateDeleteTarrif from "./Tarrif/ReadUpdateDeleteTarrif";
// import NewTripSheetEntry from "./TripSheetEntry/NewTripSheetEntry";
// import SalesAndPurchaseCalculation from "./TripSheetEntry/SalesAndPurchaseCalculation";
// import OnCallMISUpload from "./MIS/OnCallMISUpload";
// import DownloadOnCallMisData from "./MIS/DownloadOnCallMisData";
// import TarrifExcelUpload from "./Tarrif/TarrifExcelUpload";
// import SlabBaseMisUpload from "./MIS/SlabBaseMisUpload";
// import DownloadSlabBaseMis from "./MIS/DownloadSlabBaseMis";
// import DownloadTripBaseMis from "./MIS/DownloadTripBaseMis";
// import DownloadDayBaseMis from "./MIS/DownloadDayBaseMis";
// import TripBaseMisUpload from "./MIS/TripBaseMisUpload";
// import DayBaseMisUpload from "./MIS/DayBaseMisUpload";
import NewClientMaster from "./CompanyDetail/NewClientMaster";
import ListClientMaster from "./CompanyDetail/ListClientMaster";
import EditClientMaster from "./CompanyDetail/EditClientMaster";
import CreateAreaList from "./CompanyDetail/CreateAreaList";
import ListArea from "./CompanyDetail/ListArea";
import CreateVehicleType from "./CompanyDetail/CreateVehicleList";
import ListVehicleType from "./CompanyDetail/ListVehicleType";
import UploadMis from "./MIS/UploadMis";
import DownloadMis from "./MIS/DownloadMis";
import ManualInvoice from "./Invoice/ManualInvoice";
import InvoiceGenerate from "./Invoice/InvoiceGenerate";
import InvoiceList from "./Invoice/InvoiceList";
import DeleteTripsExcelData from "./Invoice/DeleteTripsExcelData";
import InvoiceNumber from "./Invoice/InvoiceNumber";
import MergeInvoiceGenerate from "./Invoice/MergeInvoiceGenerate";
import TarrifListTable from "./Tarrif/TarrifListTable";
import EditTarrifMaster from "./Tarrif/EditTarrifMaster";
import BackDatedInvoiceGenerate from "./Invoice/BackDatedInvoiceGenerate";
import SiteUploadMis from "./SiteMis/SiteUploadMis";
import { toast } from "react-toastify";

import DownloadSiteMis from "./SiteMis/DownloadSiteMis";
import ProtectedRoute from "./route/ProtectedRoute";
import LoginPage from "./authPages/LoginPage";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthError, loadUser } from "./action/userAction";
import { Layout, Flex, Dropdown } from "antd";
import HomePageHeader from "./Component/HomePageHeader";
import axios from "axios";
import moment from "moment";
import { clearError } from "./slices/authSlice";
import DeleteSiteMisData from "./SiteMis/DeleteSiteMis/DeleteSiteMisData";
import NewOwner from "./Owners/NewOwner";
import OwnerList from "./Owners/OwnerList";
import NewAgency from "./Agency/NewAgency";
import AgencyList from "./Agency/AgencyList";
import NewDriver from "./Drivers/NewDriver";
import NewVehicle from "./Vehicle/NewVehicle";
import MultipleOwnerForOneVehicle from "./Vehicle/MultipleOwnerForOneVehicle";
import EditVehicle from "./Vehicle/EditVehicle";
import DriverList from "./Drivers/DriverList";
import VehicleOwnerDetail from "./Owners/VehicleOwnerDetail";
import CreatePurchaseMemo from "./PurchaseMemo/CreatePurchaseMemo";
import ListPurchaseMemo from "./PurchaseMemo/ListPurchaseMemo";
function App() {
  const { Header, Footer, Sider, Content } = Layout;
  const headerStyle = {
    textAlign: "right",
    backgroundColor: "#310e64",
  };
  const [stripeApiKey, setStripeApiKey] = useState([]);
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated, user } = useSelector(
    (state) => state.authState
  );
  const { site_slab_base_mis_uploadlist } = useSelector(
    (state) => state.SiteSlabBaseState || []
  );
  useEffect(() => {
    dispatch(loadUser);
    async function getStripeApiKey() {
      const { data } = await axios.get(
        "/api/v1/site_mis/sitemis_missing_upload_date"
      );

      setStripeApiKey(data);
    }
    getStripeApiKey();
  }, []);

  useEffect(() => {
    if (isAuthenticated && (user.role == "sitemanager" || "admin")) {
      stripeApiKey?.outputValue?.forEach((comapny) => {
        if (comapny.remainingDates?.length) {
          if (comapny.remainingDates?.length > 2) {
            toast.warning(
              `${comapny._id}-${comapny.remainingDates?.length} days missing`
            );
          } else {
            let dateString = comapny.remainingDates.map((item) =>
              moment(item).format("MMM DD YYYY")
            );
            toast.warning(`${comapny._id}-${dateString.join(",")}  missing`);
          }
        }
      });
    }
    if (error) {
      toast(error, {
        position: toast.POSITION.BOTTOM_CENTER,
        type: "error",
        onOpen: () => {
          dispatch(clearAuthError);
        },
      });
      return;
    }
  }, [error, dispatch]);
  console.log(error);
  return (
    <BrowserRouter>
      <div className="flex">
        <aside className="w-2/12">{isAuthenticated && <NavBar />}</aside>
        <main className="w-10/12">
          {isAuthenticated && (
            <Layout>
              <Header style={headerStyle}>
                <HomePageHeader />
              </Header>
            </Layout>
          )}
          <div className="px-3">
            <div>
              <ToastContainer theme="dark" />
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route
                  exact
                  path="/"
                  element={<ProtectedRoute>{"Welcome our Att"}</ProtectedRoute>}
                />
                <Route
                  exact
                  path="/cannotaccess"
                  element={
                    <ProtectedRoute>
                      {
                        "This page You Cananot access,because you can access particular page only"
                      }
                    </ProtectedRoute>
                  }
                />
                <Route path="/add_vechicle" element={<AddVehicleList />} />
                <Route path="/vehicle_list" element={<VehicleList />} />
                <Route path="/client_master">
                  <Route
                    path="new_client_master"
                    element={<NewClientMaster />}
                  />
                  <Route
                    path="list_client_master"
                    element={<ListClientMaster />}
                  />
                  <Route
                    path="edit_client_master/:id"
                    element={<EditClientMaster />}
                  />
                  <Route path="create_area" element={<CreateAreaList />} />
                  <Route
                    path="list_area"
                    element={
                      // <ProtectedRoute isUser={true}>
                      //   {" "}
                      //   <ListArea />
                      // </ProtectedRoute>
                      <ProtectedRoute>
                        {" "}
                        <ListArea />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="create_vehicle_type"
                    element={<CreateVehicleType />}
                  />
                  <Route
                    path="vehicle_type_list"
                    element={<ListVehicleType />}
                  />
                </Route>
                <Route path="/tarrif">
                  <Route path="new_tarrif" element={<CreateNewTarrif />} />

                  <Route path="tarrif_list" element={<TarrifListTable />} />

                  <Route
                    path="edit_tarrif_list/:id"
                    element={<EditTarrifMaster />}
                  />
                </Route>

                <Route path="/mis">
                  <Route path="upload_mis" element={<UploadMis />} />
                  <Route path="download_mis" element={<DownloadMis />} />
                  <Route
                    path="delete_client_mis"
                    element={<DeleteTripsExcelData />}
                  />
                </Route>

                <Route path="/invoice">
                  <Route path="manual_invoice" element={<ManualInvoice />} />

                  <Route path="invoice_no" element={<InvoiceNumber />} />
                  <Route
                    path="invoice_generate"
                    element={<InvoiceGenerate />}
                  />

                  <Route
                    path="merge_invoice_generate"
                    element={<MergeInvoiceGenerate />}
                  />
                  {/* <Route
                  path="back_dated_invoice_generate"
                  element={<BackDatedInvoiceGenerate />}
                /> */}

                  <Route path="invoice_list" element={<InvoiceList />} />
                </Route>
                <Route path="/purchase_memo">
                  <Route
                    path="create_purchase_memo"
                    element={<CreatePurchaseMemo />}
                  />

                  <Route
                    path="list_purchase_memo"
                    element={<ListPurchaseMemo />}
                  />
                </Route>
              </Routes>
            </div>
            <Routes>
              <Route path="/site_data_mis">
                <Route
                  path="site_upload_mis"
                  element={
                    <ProtectedRoute>
                      <SiteUploadMis />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="site_download_mis"
                  element={
                    <ProtectedRoute>
                      <DownloadSiteMis />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="delete_site_mis"
                  element={
                    <ProtectedRoute isAdmin={true}>
                      <DeleteSiteMisData />
                    </ProtectedRoute>
                  }
                />
              </Route>
              <Route path="/owners">
                <Route
                  path="new_owner"
                  element={
                    <ProtectedRoute>
                      <NewOwner />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="list_owner"
                  element={
                    <ProtectedRoute>
                      <OwnerList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="vehicle_with_owner"
                  element={
                    <ProtectedRoute>
                      <VehicleOwnerDetail />
                    </ProtectedRoute>
                  }
                />
              </Route>
              <Route path="/agencies">
                <Route
                  path="new_agency"
                  element={
                    <ProtectedRoute>
                      <NewAgency />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="list_agencies"
                  element={
                    <ProtectedRoute>
                      <AgencyList />
                    </ProtectedRoute>
                  }
                />
              </Route>
              <Route path="/driver">
                <Route
                  path="new_driver"
                  element={
                    <ProtectedRoute>
                      <NewDriver />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="list_driver"
                  element={
                    <ProtectedRoute>
                      <DriverList />
                    </ProtectedRoute>
                  }
                />
              </Route>
              <Route path="/vehicle">
                <Route
                  path="new_vehicle"
                  element={
                    <ProtectedRoute>
                      <NewVehicle />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="vehicle_list"
                  element={
                    <ProtectedRoute>
                      <VehicleList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="one_vehicle_owners_list/:id"
                  element={
                    <ProtectedRoute>
                      <MultipleOwnerForOneVehicle />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="edit_vehicle/:id"
                  element={
                    <ProtectedRoute>
                      <EditVehicle />
                    </ProtectedRoute>
                  }
                />
              </Route>
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
