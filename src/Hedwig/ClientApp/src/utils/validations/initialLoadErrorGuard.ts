import { FormStatusProps } from "../../components/FormStatus/FormStatus";

export default function initialLoadErrorGuard(
  initialLoad: boolean,
  error?: FormStatusProps
) {
  if (initialLoad) {
    return undefined;
  } else {
    return error;
  }
}