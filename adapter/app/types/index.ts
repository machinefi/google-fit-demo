export interface FitSession {
  id: string;
  startTimeMillis: string;
  endTimeMillis: string;
}

// {
//   "startTimeMillis":     "1686840276000",
//   "modifiedTimeMillis":  "1686840410053",
//   "endTimeMillis":       "1686840401000",
//   "description": "",
//   "activityType": 100,
//   "application": {
//     "packageName": "at.runtastic.gpssportapp",
//     "version": "",
//     "detailsUrl": ""
//   },
//   "id": "healthkit-DE7ADF5D-26BF-4742-9FD7-55A263A124B4",
//   "name": "Yoga"
// }

export interface FitSessionRaw {
  id: string;
  modifiedTimeMillis: string;
  startTimeMillis: string;
  endTimeMillis: string;
  activityType: number;
  description: string;
  application: {
    packageName: string;
    version: string;
    detailsUrl: string;
  };
  name: string;
}
