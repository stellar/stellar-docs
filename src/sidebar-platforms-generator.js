// import fs from "fs";
// import path from "path";

module.exports = async ({ defaultSidebarItemsGenerator, ...args }) => {
  // const docs = args.docs.filter(
  //   (item) =>
  //     !item.source.includes(".api.mdx") &&
  //     !item.source.includes(".tag.mdx") &&
  //     item.source !== "@site/api/READ_FIRST.md",
  // );

  const sidebarItems = await defaultSidebarItemsGenerator({ ...args });
  // console.log('sidebarItems', sidebarItems)

  // const apiReference = sidebarItems.find(
  //   (item) =>
  //     item.type === "category" && item.label.toLowerCase() === 'api reference',
  // );

  // if (apiReference) {
  //   const resources = apiReference.items.find(
  //     (item) =>
  //       item.type === "category" && item.label.toLowerCase() === "resources",
  //   );
  //   const callbacks = apiReference.items.find(
  //     (item) =>
  //       item.type === "category" && item.label.toLowerCase() === "callbacks",
  //   );
  //   const custody = apiReference.items.find(
  //     (item) =>
  //       item.type === "category" && item.label.toLowerCase() === "custody",
  //   );

  //   const sidebarPath = path.join(
  //     args.version.contentPath,
  //     args.item.dirName,
  //     "./api-reference/sidebar.ts",
  //   );

  //   if (resources && fs.existsSync(sidebarPath)) {
  //     const generatedApiSidebar = require(sidebarPath)[0];

  //     const categories = resources.items.filter(
  //       (item) => item.type === "category",
  //     );

  //     categories.forEach((category) => {
  //       const generatedCategory = generatedApiSidebar.items.find(
  //         (item) => item.type === "category" && item.label === category.label,
  //       );

  //       if (generatedCategory) {
  //         category.items = [...category.items, ...generatedCategory.items];
  //       }
  //     });
  //   }

  //   if (callbacks && fs.existsSync(sidebarPath)) {
  //     const generatedApiSidebar = require(sidebarPath)[1];

  //     const categories = callbacks.items.filter(
  //         (item) => item.type === "category",
  //     );

  //     categories.forEach((category) => {
  //       const generatedCategory = generatedApiSidebar.items.find(
  //           (item) => item.type === "category" && item.label === category.label,
  //       );

  //       if (generatedCategory) {
  //         category.items = [...category.items, ...generatedCategory.items];
  //       }
  //     });
  //   }

  //   if (custody && fs.existsSync(sidebarPath)) {
  //     const generatedApiSidebar = require(sidebarPath)[2];

  //     const categories = custody.items.filter(
  //         (item) => item.type === "category",
  //     );

  //     categories.forEach((category) => {
  //       const generatedCategory = generatedApiSidebar.items.find(
  //           (item) => item.type === "category" && item.label === category.label,
  //       );

  //       if (generatedCategory) {
  //         category.items = [...category.items, ...generatedCategory.items];
  //       }
  //     });
  //   }
  // }

  return sidebarItems;
};
