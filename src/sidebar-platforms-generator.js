const fs = require("fs");
const path = require("path");

module.exports = async ({ defaultSidebarItemsGenerator, ...args }) => {
  const docs = args.docs.filter(
    (item) =>
      !item.source.includes(".api.mdx") &&
      !item.source.includes(".tag.mdx") &&
      item.source !== "@site/api/READ_FIRST.md",
  );

  const sidebarItems = await defaultSidebarItemsGenerator({ ...args, docs });

  const apiReference = sidebarItems.find(
    (item) =>
      item.type === "category" && item.label.toLowerCase() === 'api reference',
  );

  if (apiReference) {
    const resources = apiReference.items.find(
      (item) =>
        item.type === "category" && item.label.toLowerCase() === "resources",
    );

    const sidebarPath = path.join(
      args.version.contentPath,
      args.item.dirName,
      "./api-reference/resources/sidebar.js",
    );

    if (resources && fs.existsSync(sidebarPath)) {
      const generatedApiSidebar = require(sidebarPath);

      const categories = resources.items.filter(
        (item) => item.type === "category",
      );

      categories.forEach((category) => {
        const generatedCategory = generatedApiSidebar.find(
          (item) => item.type === "category" && item.label === category.label,
        );

        if (generatedCategory) {
          category.items = [...category.items, ...generatedCategory.items];
        }
      });
    }

    const resources2 = apiReference.items.find(
        (item) =>
            item.type === "category" && item.label.toLowerCase() === "callbacks",
    );

    const sidebarPath2 = path.join(
        args.version.contentPath,
        args.item.dirName,
        "./api-reference/callbacks/sidebar.js",
    );

    if (resources2 && fs.existsSync(sidebarPath2)) {
      const generatedApiSidebar = require(sidebarPath2);

      const categories = resources2.items.filter(
          (item) => item.type === "category",
      );

      categories.forEach((category) => {
        const generatedCategory = generatedApiSidebar.find(
            (item) => item.type === "category" && item.label === category.label,
        );

        if (generatedCategory) {
          category.items = [...category.items, ...generatedCategory.items];
        }
      });
    }

    const resources3 = apiReference.items.find(
        (item) =>
            item.type === "category" && item.label.toLowerCase() === "custody server",
    );

    const sidebarPath3 = path.join(
        args.version.contentPath,
        args.item.dirName,
        "./api-reference/custody-server/sidebar.js",
    );

    if (resources3 && fs.existsSync(sidebarPath3)) {
      const generatedApiSidebar = require(sidebarPath3);

      const categories = resources3.items.filter(
          (item) => item.type === "category",
      );

      categories.forEach((category) => {
        const generatedCategory = generatedApiSidebar.find(
            (item) => item.type === "category" && item.label === category.label,
        );

        if (generatedCategory) {
          category.items = [...category.items, ...generatedCategory.items];
        }
      });
    }
  }

  return sidebarItems;
};
