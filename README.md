# CAD Design Visualizer

This repository is used to generate prototypes to visualize individual components of any CAD design in formats such as STL, OBJ and FBX. The application includes a save feature, allowing users to store and revisit all previously created designs.

## Technologies Used

- **React**: A JavaScript library for building user interfaces.
  - Documentation: [React Documentation](https://react.dev/reference/react)
- **Material UI**: A popular React UI framework that provides components for faster and easier web development.
  - Documentation: [Material UI Documentation](https://mui.com/material-ui/getting-started/)
- **Three.js**: A 3D library that makes WebGL simpler and easier to use.
  - Documentation: [Three.js Documentation](https://threejs.org/docs/#manual/en/introduction/Creating-a-scene)
- **Redux Toolkit**: A toolset for efficient Redux development.
  - Documentation: [Redux Toolkit Documentation](https://redux-toolkit.js.org/introduction/getting-started)

## Features

- **Visualize CAD Designs**: Upload and visualize CAD files in STL, OBJ and FBX formats.
- **Component Interaction**: View and interact with individual components of the uploaded CAD design.
- **Save Renderings**: Save and store previous renderings for future reference.

## Getting Started

Follow the steps below to set up and run the project on your local machine:

### Prerequisites

- Ensure that Node.js and npm are installed on your machine. You can download them from [here](https://nodejs.org/).

### Installation

1. **Clone this repository**:

   ```bash
   git clone https://github.com/yuvraj-singh-49/generic-prototype-web.git
   ```

2. **Navigate to the project directory**:

   ```bash
   cd generic-prototype-web
   ```

3. **Install the dependencies**:
   ```bash
   npm install
   ```

### Running the Application

4. **Run the application**:
   ```bash
   npm run dev
   ```
   The application will start on port 3000 by default. You can access it by navigating to `http://localhost:3000` in your browser.

### Deployment

This frontend is deployed on Firebase Hosting, which provides a reliable and scalable platform for deploying web applications.

To deploy the application yourself:

1. Ensure Firebase CLI is installed: `npm install -g firebase-tools`
2. Login to Firebase: `firebase login`
3. Initialize Firebase in your project directory: `firebase init`
4. Deploy the application: `firebase deploy`

### Contributing

If you'd like to contribute to this project, please fork the repository, create a new branch for your feature or bug fix, and submit a pull request. We welcome all contributions!

### License

This project is licensed under the MIT License - see the [LICENSE](../../../generic-prototype-web/blob/main/LICENSE) file for details.
