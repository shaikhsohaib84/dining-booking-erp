export const localDateTime = (UTCDateTimeString) => {
    const utcDate = new Date(UTCDateTimeString);
    const localDate = utcDate.toLocaleString('en-US', {
        hour12: true,
    });
    console.log({localDate, UTCDateTimeString});
    return localDate
}