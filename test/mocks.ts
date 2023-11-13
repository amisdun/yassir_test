export const mockAirQualityData = {
  data: {
    status: 'success',
    data: {
      city: 'Paris',
      state: 'Ile-de-France',
      country: 'France',
      location: {
        type: 'Point',
        coordinates: [2.351666, 48.859425],
      },
      current: {
        pollution: {
          ts: '2023-11-13T15:00:00.000Z',
          aqius: 20,
          mainus: 'o3',
          aqicn: 15,
          maincn: 'p1',
        },
        weather: {
          ts: '2023-11-13T15:00:00.000Z',
          tp: 17,
          pr: 1005,
          hu: 90,
          ws: 8.75,
          wd: 230,
          ic: '04d',
        },
      },
    },
  },
};
