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

const fileName = `${elementName}`;
const template = `
import {lazy} from "react"

export const ${name}Page = lazy(() => import('./${elementName}Page'))
`;

const templatePage = `
import {MainLayout} from "../../layout/mainLayout"


const ${name}Page = () => {

    return (
        <MainLayout heading={''}>
            <div></div>
        </MainLayout>
    );
};
export default ${name}Page;
`
const filePathLazy = path.join(componentDirectory, `${fileName}PageLazy.tsx`);
const filePath = path.join(componentDirectory, `${fileName}Page.tsx`);
fs.writeFileSync(filePath, templatePage);
fs.writeFileSync(filePathLazy, template);
