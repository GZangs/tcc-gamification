import { Icon } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import Border from "../Border";

const DiamondBorder = ({ children }) => {
  const { t } = useTranslation();
  let icon = (
    <span>
      <Icon type="star" style={{ fontSize: 18, color: "#c734a0" }} />
      <Icon type="star" style={{ fontSize: 23, color: "#c7a915" }} />
      <Icon type="rocket" style={{ fontSize: 30, color: "#8f6cf7" }} />
      <Icon type="star" style={{ fontSize: 23, color: "#c7a915" }} />
      <Icon type="star" style={{ fontSize: 18, color: "#c734a0" }} />
    </span>
  );
  
  return (
    <Border
      mainColor="#6247AA"
      customBackground="linear-gradient(316deg, #6247aa 0%, #a594f9 74%)"
      title={t("border.titles.diamond")}
      borderIcon={icon}
    >
      {children}
    </Border>
  );
};

export default DiamondBorder;
