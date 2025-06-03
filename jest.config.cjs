// jest.config.cjs
module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
    // Mock static assets like SVGs
    '^.+\\.(svg|png|jpg|jpeg|gif|webp|avif|ico)$': '<rootDir>/svgTransform.cjs',
  },
  moduleFileExtensions: ['js', 'jsx'],
  setupFilesAfterEnv: ['./jest.setup.js'],
  moduleNameMapper: {
    // Mock Vite's absolute import for vite.svg
    '^/vite.svg$': '<rootDir>/src/assets/react.svg',
    '^.+\\.(css|scss|sass)$': '<rootDir>/styleMock.cjs',
  },
};
