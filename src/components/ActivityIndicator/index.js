import React from "react";
import Lottie from "react-lottie";

import Loader from "../../assets/animations/loader.json";

const ActivityIndicator = ({ visible }) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: Loader,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  if (!visible) return null;
  return <Lottie options={defaultOptions} height={100} width={100} />;
};

export default ActivityIndicator;
