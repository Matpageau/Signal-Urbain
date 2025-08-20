import mongoose from "mongoose";
import Report, { iReportValues, categoryEnum, statusEnum } from "../models/Report";

export const createDefaultReports = async () => {

  const defaultPotHoleOne: iReportValues = {
    _id: new mongoose.Types.ObjectId("777000000000000000000001"),
    category: categoryEnum.POTHOLE,
    status: statusEnum.CREATED,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque quis neque lacus. In in libero luctus, fringilla arcu eget, venenatis turpis. Praesent pharetra scelerisque dictum. Praesent sed eleifend urna. Nulla ultrices volutpat maximus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque quis neque lacus. In in libero luctus, fringilla arcu eget, venenatis turpis. Praesent pharetra scelerisque dictum. Praesent sed eleifend urna. Nulla ultrices volutpat maximus.Lorems.",
    long: -71.79702,
    lat: 45.13266,
    upvote_user_ids: [],
    medias: ["https://sripath.com/wp-content/uploads/2025/01/iStock-174662203.jpg"]
  };
  
  const defaultPotHoleTwo: iReportValues = {
    _id: new mongoose.Types.ObjectId("777000000000000000000002"),
    category: categoryEnum.POTHOLE,
    status: statusEnum.CREATED,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque quis neque lacus. In in libero luctus, fringilla arcu eget, venenatis turpis. Praesent pharetra scelerisque dictum. Praesent sed eleifend urna. Nulla ultrices volutpat maximus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque quis neque lacus. In in libero luctus, fringilla arcu eget, venenatis turpis. Praesent pharetra scelerisque dictum. Praesent sed eleifend urna. Nulla ultrices volutpat maximus.Lorems.",
    long: -73.79702,
    lat: 47.13266,
    upvote_user_ids: [],
    medias: ["https://www.unionmutual.com/wp-content/uploads/2016/07/Potholes-resized-for-blog.jpg"]
  };

    const defaultDmgedSign: iReportValues = {
    _id: new mongoose.Types.ObjectId("777000000000000000000003"),
    category: categoryEnum.DMGELEMENT,
    status: statusEnum.CREATED,
    description: "Panneau de circulation tordu et illisible, représente un danger pour les automobilistes.",
    long: -71.21245,
    lat: 46.81388,
    upvote_user_ids: [],
    medias: ["https://i.shgcdn.com/b0479b9c-a292-43df-a700-1c4ea6130607/-/format/auto/-/preview/3000x3000/-/quality/lighter/"]
  };

  const defaultRoadObstacle: iReportValues = {
    _id: new mongoose.Types.ObjectId("777000000000000000000004"),
    category: categoryEnum.ROADOBSTACLE,
    status: statusEnum.CREATED,
    description: "Rondin d’arbre tombé au milieu de la route après une tempête.",
    long: -72.52891,
    lat: 46.34567,
    upvote_user_ids: [],
    medias: ["https://www.codever.fr/upload/images/posts/3b3967d34223d2ddfc315a7e42b066c6.JPG"]
  };

  const defaultFaultyLight: iReportValues = {
    _id: new mongoose.Types.ObjectId("777000000000000000000005"),
    category: categoryEnum.FAULTYLIGHT,
    status: statusEnum.CREATED,
    description: "Lampadaire de rue qui clignote sans cesse, problème de sécurité la nuit.",
    long: -73.23456,
    lat: 45.67891,
    upvote_user_ids: [],
    medias: ["https://www.rrbslawnj.com/wp-content/uploads/2024/12/240_F_113286904_SnBrJyYmaCwZ7byEReCJ8Br4Y5hPTf8m.jpg"]
  };

  const defaultDangerousTree: iReportValues = {
    _id: new mongoose.Types.ObjectId("777000000000000000000006"),
    category: categoryEnum.DANGEROUSTREE,
    status: statusEnum.CREATED,
    description: "Arbre penché risquant de tomber sur la chaussée après de forts vents.",
    long: -70.98765,
    lat: 46.54321,
    upvote_user_ids: [],
    medias: ["https://res.cloudinary.com/jerrick/image/upload/d_642250b563292b35f27461a7.png,f_jpg,fl_progressive,q_auto,w_1024/67ed79aafd74a4001d6f0647.jpg"]
  };

  const defaultVandalism: iReportValues = {
    _id: new mongoose.Types.ObjectId("777000000000000000000007"),
    category: categoryEnum.VANDALISM,
    status: statusEnum.CREATED,
    description: "Panneau recouvert de graffitis non autorisés à l’entrée d’un parc public.",
    long: -72.11111,
    lat: 46.22222,
    upvote_user_ids: [],
    medias: ["https://cloudfront-us-east-1.images.arcpublishing.com/lescoopsdelinformation/FZ4H2DM7VJHEJN6CFTYHXAKWIA.jpg"]
  };

  const defaultOther: iReportValues = {
    _id: new mongoose.Types.ObjectId("777000000000000000000008"),
    category: categoryEnum.OTHER,
    status: statusEnum.CREATED,
    description: "Banc public brisé près d’un arrêt d’autobus, inutilisable pour les passants.",
    long: -73.87654,
    lat: 45.43210,
    upvote_user_ids: [],
    medias: ["https://thumbs.dreamstime.com/b/un-sans-abri-dort-sur-le-banc-de-l-arr%C3%AAt-bus-%C3%A0-baltimore-maryland-octobre-219416799.jpg"]
  };

  const defaultAnotherObstacle: iReportValues = {
    _id: new mongoose.Types.ObjectId("777000000000000000000009"),
    category: categoryEnum.ROADOBSTACLE,
    status: statusEnum.CREATED,
    description: "Cône de construction abandonné au milieu de la rue, perturbant la circulation.",
    long: -71.54321,
    lat: 46.87654,
    upvote_user_ids: [],
    medias: ["https://img.over-blog-kiwi.com/0/85/30/76/20180206/ob_0e10fb_co-ne-oublie.JPG"]
  };
  

  const isPhOneExisting = await Report.findReportById(defaultPotHoleOne._id!.toString());
  const isPhTwoExisting = await Report.findReportById(defaultPotHoleTwo._id!.toString());
  const isDmgedSignExisting = await Report.findReportById(defaultDmgedSign._id!.toString());
  const isRoadObstacleExisting = await Report.findReportById(defaultRoadObstacle._id!.toString());
  const isFaultyLightExisting = await Report.findReportById(defaultFaultyLight._id!.toString());
  const isDangerousTreeExisting = await Report.findReportById(defaultDangerousTree._id!.toString());
  const isVandalismExisting = await Report.findReportById(defaultVandalism._id!.toString());
  const isOtherExisting = await Report.findReportById(defaultOther._id!.toString());
  const isAnotherObstacleExisting = await Report.findReportById(defaultAnotherObstacle._id!.toString());

  if (!isDmgedSignExisting) {
    await Report.createReport(defaultDmgedSign);
  }
  if (!isRoadObstacleExisting) {
    await Report.createReport(defaultRoadObstacle);
  }
  if (!isFaultyLightExisting) {
    await Report.createReport(defaultFaultyLight);
  }
  if (!isDangerousTreeExisting) {
    await Report.createReport(defaultDangerousTree);
  }
  if (!isVandalismExisting) {
    await Report.createReport(defaultVandalism);
  }
  if (!isOtherExisting) {
    await Report.createReport(defaultOther);
  }
  if (!isAnotherObstacleExisting) {
    await Report.createReport(defaultAnotherObstacle);
  }
  if (!isPhOneExisting) {
    await Report.createReport(defaultPotHoleOne);
  }
  if (!isPhTwoExisting) {
    await Report.createReport(defaultPotHoleTwo);
  }
  else {
    console.log("Default reports already exist. No new report created.");
  }
}
