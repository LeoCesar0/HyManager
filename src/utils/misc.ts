type CxItemType = undefined | string | [string, boolean];
type CxPropsType = CxItemType[];

export const cx = (arrayProps: CxPropsType): string => {
  let finalClassName = "";

  for (const item of arrayProps) {
    if (item) {
      if (typeof item === "string") {
        finalClassName += ` ${item} `;
      } else {
        const [itemClassName, itemBoolean] = item;
        if (itemBoolean === true) {
          finalClassName += ` ${itemClassName} `;
        }
      }
    }
  }
  return finalClassName;
};


export const debugLog = (variable: any, name: string) => {
  console.log(`${name} -->`, variable)
} 