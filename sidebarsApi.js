// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  apiSidebar: [
    {
      type: "category",
      label: "Resources",
      items: require("./api/resources/sidebar"),
    },
  ],
};

module.exports = sidebars;
