const fs = require('fs');
const path = require('path');
const process = require('process');




const [directoriName] = process.argv.slice(2);
const [elementName] = process.argv.slice(3);

const name = elementName.charAt(0).toUpperCase() + elementName.slice(1);

const srcDirectory = path.join(__dirname, '../src',directoriName);
if (!fs.existsSync(srcDirectory)) {
  fs.mkdirSync(srcDirectory);
}
const componentDirectory = path.join(srcDirectory, elementName);
if (!fs.existsSync(componentDirectory)) {
  fs.mkdirSync(componentDirectory);
}

const fileName = `${elementName}.tsx`;
const template = `
import React,{FC,memo}  from "react";
import classes from './${elementName}.module.scss'


interface IType{
  children?: React.ReactNode
}

export const ${name}: FC<IType> = memo(({children}) => {
    return (
        <div className={classes.${elementName}}>
            {children}
        </div>
    )
}) 
`;
const templateCss =`
.${elementName} {
  
}
`
const filePath = path.join(componentDirectory, fileName);
const filePathCss = path.join(componentDirectory, `${elementName}.module.scss`);
fs.writeFileSync(filePath, template);
fs.writeFileSync(filePathCss, templateCss);
