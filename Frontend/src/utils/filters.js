export const getDistrictsByState = (districts, state) => {
    if (!state) return [];
    return districts.filter(item => item.state === state);
  };
  
  export const getTalukasByDistrict = (talukas, district) => {
    if (!district) return [];
    return talukas.filter(item => item.district === district);
  };
  
  export const getQualificationLevels = (qualificationLevels) => {
    return qualificationLevels.map(item => item.level);
  };
  
  export const getStreams = (streamsData) => {
    return streamsData.map(item => item.stream);
  };
  
  export const filterColleges = (colleges, filters) => {
    const {
      state,
      district,
      taluka,
      stream,
      qualificationLevel
    } = filters;
  
    return colleges.filter(item => {
      if (state && item.state !== state) return false;
      if (district && item.district !== district) return false;
      if (taluka && item.taluka !== taluka) return false;
      if (stream && !item.streams.includes(stream)) return false;
      if (qualificationLevel && !item.qualificationLevels.includes(qualificationLevel)) return false;
      return true;
    });
  };
  