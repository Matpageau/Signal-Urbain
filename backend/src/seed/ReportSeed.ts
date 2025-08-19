import mongoose from "mongoose";
import Report, { iReportValues, categoryEnum, statusEnum } from "../models/Report";

export const createDefaultReports = async () => {

  const defaultPotHoleOne: iReportValues = {
    _id: new mongoose.Types.ObjectId("777000000000000000000001").toString(),
    category: categoryEnum.POTHOLE,
    status: statusEnum.CREATED,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque quis neque lacus. In in libero luctus, fringilla arcu eget, venenatis turpis. Praesent pharetra scelerisque dictum. Praesent sed eleifend urna. Nulla ultrices volutpat maximus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque quis neque lacus. In in libero luctus, fringilla arcu eget, venenatis turpis. Praesent pharetra scelerisque dictum. Praesent sed eleifend urna. Nulla ultrices volutpat maximus.Lorems.",
    long: -71.79702,
    lat: 45.13266,
    upvote: 504,
    medias: ["https://sripath.com/wp-content/uploads/2025/01/iStock-174662203.jpg"]
  };
  
  const defaultPotHoleTwo: iReportValues = {
    _id: new mongoose.Types.ObjectId("777000000000000000000002").toString() || null,
    category: categoryEnum.POTHOLE,
    status: statusEnum.CREATED,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque quis neque lacus. In in libero luctus, fringilla arcu eget, venenatis turpis. Praesent pharetra scelerisque dictum. Praesent sed eleifend urna. Nulla ultrices volutpat maximus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque quis neque lacus. In in libero luctus, fringilla arcu eget, venenatis turpis. Praesent pharetra scelerisque dictum. Praesent sed eleifend urna. Nulla ultrices volutpat maximus.Lorems.",
    long: -73.79702,
    lat: 47.13266,
    upvote: 291,
    medias: ["https://www.unionmutual.com/wp-content/uploads/2016/07/Potholes-resized-for-blog.jpg"]
  };
  
  const isPhOneExisting = await Report.findReportById(defaultPotHoleOne._id!);
  const isPhTwoExisting = await Report.findReportById(defaultPotHoleTwo._id!);
  
  if (!isPhOneExisting) {
    await Report.createReport(defaultPotHoleOne);
  }
  if (!isPhTwoExisting) {
    await Report.createReport(defaultPotHoleTwo);
  }

  if (isPhOneExisting && isPhTwoExisting) {
    console.log(``);
    console.log(`Default potholes already exist.`);
    console.log(``);
  }
}
