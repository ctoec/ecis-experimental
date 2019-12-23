export function determinationArgsAreValid(args: any) {
  if (args.notDisclosed) {
    args.numberOfPeople = null;
    args.income = null;
    args.determinationDate = null;
    return true;
  }

  if(args.numberOfPeople && args.income && args.determinationDate) {
    args.notDisclosed = false;
    return true;
  }

  return false;
}