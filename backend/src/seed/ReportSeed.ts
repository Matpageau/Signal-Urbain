// import mongoose from "mongoose";
// import Report, { iReportValues, categoryEnum, statusEnum } from "../models/Report";
// import { REFUSED } from "dns";

// export const createDefaultReports = async () => {

//   const defaultPotHoleOne = {
//     _id: new mongoose.Types.ObjectId("777000000000000000000001").toString(),
//     category: categoryEnum.POTHOLE,
//     status: statusEnum.CREATED,
//     description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque quis neque lacus. In in libero luctus, fringilla arcu eget, venenatis turpis. Praesent pharetra scelerisque dictum. Praesent sed eleifend urna. Nulla ultrices volutpat maximus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque quis neque lacus. In in libero luctus, fringilla arcu eget, venenatis turpis. Praesent pharetra scelerisque dictum. Praesent sed eleifend urna. Nulla ultrices volutpat maximus.Lorems.",
//     long: -71.79702,
//     lat: 45.13266,
//     upvote: 1,
//     media: ["https://www.unionmutual.com/wp-content/uploads/2016/07/Potholes-resized-for-blog.jpg"]
//   };
  
//   const defaultPotHoleTwo = {
//     _id: new mongoose.Types.ObjectId("777000000000000000000002").toString(),
//     category: categoryEnum.POTHOLE,
//     status: statusEnum.CREATED,
//     description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque quis neque lacus. In in libero luctus, fringilla arcu eget, venenatis turpis. Praesent pharetra scelerisque dictum. Praesent sed eleifend urna. Nulla ultrices volutpat maximus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque quis neque lacus. In in libero luctus, fringilla arcu eget, venenatis turpis. Praesent pharetra scelerisque dictum. Praesent sed eleifend urna. Nulla ultrices volutpat maximus.Lorems.",
//     long: -75.79702,
//     lat: 42.13266,
//     upvote: 1,
//     media: ["https://www.unionmutual.com/wp-content/uploads/2016/07/Potholes-resized-for-blog.jpg"]
//   };
  
//   const isPhOneExisting = await Report.findReportById(defaultPotHoleOne._id);
//   const isPhTwoExisting = await Report.findReportById(defaultPotHoleTwo._id);
  
//   if (!isPhOneExisting) {
//     await Report.createReport(defaultPotHoleOne);
//   }
//   if (!isPhTwoExisting) {
//     await Report.createReport(defaultPotHoleTwo);
//   }

//   if (isPhOneExisting && isPhTwoExisting) {
//     console.log(``);
//     console.log(`Default potholes already exist.`);
//     console.log(``);
//   }
// }
