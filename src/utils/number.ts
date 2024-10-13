export const formatSpacePledged = (value: bigint, decimals = 2) => {
    if (typeof value !== 'bigint' || value === BigInt(0)) return '0 Bytes'
  
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
  
    const i = Math.floor(Math.log(Number(value)) / Math.log(k))
  
    return (Number(value) / Math.pow(k, i)).toFixed(dm) + ' ' + sizes[i]
  }