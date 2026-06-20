import React from 'react';

jest.mock('react-native-bootsplash', () => {
  return {
    hide: jest.fn().mockResolvedValue(),
    isVisible: jest.fn().mockResolvedValue(false),
    useHideAnimation: jest.fn().mockReturnValue({
      container: {},
      logo: {source: 0},
      brand: {source: 0},
    }),
  };
});

jest.mock('@callstack/repack/client', () => ({
  Federated: {
    importModule: jest.fn((container, module) => {
      if (container === 'news') {
        switch (module) {
          case './App':
            return Promise.resolve({default: () => <></>});
          default:
            throw new Error(`NewsMock: unknown module: ${module}`);
        }
      }
      if (container === 'booking') {
        switch (module) {
          case './App':
            return Promise.resolve({default: () => <></>});
          default:
            throw new Error(`BookingMock: unknown module: ${module}`);
        }
      }
      throw new Error('jest.setup.js: unknown container: ' + container);
    }),
  },
}));
