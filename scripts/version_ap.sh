##### ANCHOR PLATFORM VERSIONING PROCESS

# Steps I'm using to cut a new version of the Anchor Platform (probably don't
# _actually_ run this as a script, but more use it for copy/pasta inspiration)

# 1. use docusaurus to create a new version of the `ap` plugin instance
yarn docusaurus docs:version:ap 2.8.4 # this creates the new /ap_versioned_etc directories

# 2. copy existing (bundled) specs to versioned specfile dir
cp openapi/anchor-platform/bundled-platform.yaml openapi/anchor-platform/versions/platform-2.8.4.yaml
cp openapi/anchor-platform/bundled-callbacks.yaml openapi/anchor-platform/versions/callbacks-2.8.4.yaml
cp openapi/anchor-platform/bundled-custody.yaml openapi/anchor-platform/versions/custody-2.8.4.yaml

# 3. add version to openapi plugin configurations in
#    `/config/anchorPlatform.config.ts`. this lets us update the versioned
#    generated docs when needed. (Just duplicate what's already there, but
#    replace the version numbers where necessary)

# 4. generate the 2.x branch of the api docs
# (cleaning is optional, i think?)
yarn docusaurus clean-api-docs:version -p ap-apis ap_platform:2.8.4
yarn docusaurus clean-api-docs:version -p ap-apis ap_callbacks:2.8.4
yarn docusaurus clean-api-docs:version -p ap-apis ap_custody:2.8.4
# generate the mdx pages
yarn docusaurus gen-api-docs:version -p ap-apis ap_platform:2.8.4
yarn docusaurus gen-api-docs:version -p ap-apis ap_callbacks:2.8.4
yarn docusaurus gen-api-docs:version -p ap-apis ap_custody:2.8.4
# remove the unwanted *.info.mdx files
rm ap_versioned_docs/**/*.info.mdx

# 4. generate the 3.x branch of the api docs
# (cleaning is optional, i think?)
yarn docusaurus clean-api-docs -p ap-apis ap_platform
yarn docusaurus clean-api-docs -p ap-apis ap_callbacks
yarn docusaurus clean-api-docs -p ap-apis ap_custody
# generate the mdx pages
yarn docusaurus gen-api-docs -p ap-apis ap_platform
yarn docusaurus gen-api-docs -p ap-apis ap_callbacks
yarn docusaurus gen-api-docs -p ap-apis ap_custody
# remove the unwanted *.info.mdx files
rm platforms/anchor-platform/**/*.info.mdx
