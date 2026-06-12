export const apiEnvelope = <T>(
  success: boolean,
  message: string,
  data?: T,
) => ({
  success,
  message,
  data,
});
