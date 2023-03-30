const fs = require("fs");
const path = require("path");

module.exports = async ({ defaultSidebarItemsGenerator, ...args }) => {
  const docs = args.docs.filter(
    (item) =>
      !item.source.includes(".api.mdx") &&
      !item.source.includes(".tag.mdx") &&
      item.source !== '@site/api/READ_FIRST.md',
  );

  const sidebarItems = await defaultSidebarItemsGenerator({ ...args, docs });

  const resources = sidebarItems.find(
    (item) =>
      item.type === "category" && item.label.toLowerCase() === "resources",
  );

  const sidebarPath = path.join(
    args.version.contentPath,
    "./resources/sidebar.js",
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

  return sidebarItems;
};
