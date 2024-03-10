export const localDateTime = (UTCDateTimeString) => {
    const utcDate =  new Date(UTCDateTimeString);
    return utcDate.toLocaleString('en-US', {
        hour12: true,
    });
}

export const tableIdArray = (tableArray) => {
    return tableArray.map((ins, idx) => {
        ins['tableId'] = idx + 1;
        return ins;
    })
}