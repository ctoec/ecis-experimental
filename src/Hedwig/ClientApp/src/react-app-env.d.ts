/// <reference types="react-scripts" />
declare module 'd3-array' {
  export function group(thingToGroup: any[], ...otherArgs): any;
  // Added because the type declaration module for d3 array is wrong about this func
}
