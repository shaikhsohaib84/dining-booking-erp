export const localDateTime = (UTCDateTimeString) => {
    const utcDate =  new Date(UTCDateTimeString);
    return utcDate.toLocaleString('en-US', {
        hour12: true,
    });
}