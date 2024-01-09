const fs = require('fs')
const path = require('path')

module.exports = async ({ defaultSidebarItemsGenerator, ...args }) => {

    if (args.version.contentPath.endsWith('docs')) {
        /**
         * Adds a custom class name to the "Tutorials" and "How-To Guides" index
         * pages, which we then use in the `/src/css/custom.scss` file to hide
         * the `<ul>` element that is contained within the item. The result is a
         * single "Tutorials/Guides" page that contains the list of all the docs
         * underneath it, while those items are not displayed in the sidebar.
         */
        args.docs.map((doc) => {
            if (doc.id === 'guides/README' || doc.id === 'tutorials/README') {
                doc.frontMatter.sidebar_class_name = "sidebar-category-items-hidden"
            }
        })
    } else if (args.version.contentPath.endsWith('guides')) {
        /**
         * Adds the `hide_table_of_contents` directive to each of the "Guides"
         * docs so that the page width isn't shrunk down.
         *
         * @todo For whatever reason, this doesn't appear to work like the
         * sidebar class name does (above). For now, make sure to manually add
         * `hide_table_of_contents: true` to the front matter of each guide doc.
         */
        args.docs.map((doc) => {
            doc.frontMatter.hide_table_of_contents = true
        })
    }

    const sidebarItems = await defaultSidebarItemsGenerator({ ...args })
    return sidebarItems
}
