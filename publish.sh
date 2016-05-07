mkdir -p publish
cp -R server/* publish/
cd client/ && ./node_modules/.bin/webpack
cd ../
rm -R publish/public
cp -R client/public publish/public
cd publish
git add .
git commit -m "update"
git push heroku master
