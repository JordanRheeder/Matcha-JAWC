sudo apt-get install curl
curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash -
sudo apt-get install nodejs

npm install -g nodemon
npm install
touch .env
echo "SESSION_SECRET=MatchyMatcha
URI = 'mongodb+srv://Admin:Epicrouter1@cluster0-fkcom.mongodb.net/matcha?retryWrites=true&w=majority'" >> ./.env
node -v 
npm -v 
