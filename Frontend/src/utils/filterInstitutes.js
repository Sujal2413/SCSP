export function filterInstitutes(institutes, filters) {
  return institutes.filter((inst) => {
    const matchState =
      !filters.state || inst.state === filters.state;

    const matchDistrict =
      !filters.district || inst.district === filters.district;

    const matchTaluka =
      !filters.taluka || inst.taluka === filters.taluka;

    const matchQualification =
      !filters.qualificationLevel ||
      inst.qualificationLevels?.includes(filters.qualificationLevel);

    const matchStream =
      !filters.stream ||
      inst.streams?.includes(filters.stream);

    return (
      matchState &&
      matchDistrict &&
      matchTaluka &&
      matchQualification &&
      matchStream
    );
  });
}
 
  