# Use an official Node.js runtime as a parent image
FROM node:14-alpine

	
# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./


# Remove node_modules and package-lock.json if they exist
RUN rm -rf node_modules package-lock.json

#RUN npm uninstall eslint-plugin-html 

# Install dependencies
RUN npm install

# Install OpenLayers
RUN npm install ol

# Install Leaflet and React-Leaflet
RUN npm install leaflet react-leaflet

# Install Mapbox GL
RUN npm install mapbox-gl

# Install Bootstrap and React-Bootstrap
RUN npm install bootstrap react-bootstrap

# Install dependencies including @fortawesome/react-fontawesome and @fortawesome/free-solid-svg-icons
RUN npm install @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons

RUN npm install --save @fortawesome/fontawesome-free


# Install Material-UI Core
RUN npm install @material-ui/core @material-ui/icons

RUN npm install eslint-plugin-html --save-dev

RUN npm install react-tabs

# Install Turf
RUN npm install @turf/turf

# Copy the rest of the application code to the working directory
COPY . .

# Build the React application for production
RUN npm run build

# Expose port 3000 to the outside world
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]

