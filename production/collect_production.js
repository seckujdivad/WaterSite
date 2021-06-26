const fs = require("fs");
const path = require("path");

//runs from root
const PROD_DIR = path.join("production/serve");
const BUILD_DIR = path.join("dist");
const PUBLIC_DIR = path.join("public");

console.log("Collecting production files...");

//reset production directory
if (fs.existsSync(PROD_DIR))
{
	fs.rmdirSync(PROD_DIR, {recursive: true});
	console.log("Removed old files");
}

//copy in public assets
function copyDir(target, destination)
{
	if (fs.existsSync(destination))
	{
		console.log(target + " =/> " + destination + " - exists");
	}
	else
	{
		fs.mkdirSync(destination);
		console.log(target + " => " + destination);
	}

	let items = fs.readdirSync(target, {withFileTypes: true});
	for (const item of items)
	{
		if (item.isDirectory())
		{
			copyDir(path.join(target, item.name), path.join(destination, item.name));
		}
		else if (item.isFile())
		{
			let src = path.join(target, item.name);
			let dest = path.join(destination, item.name);
			fs.copyFile(src, dest,
				err => {
					if (err)
					{
						throw err;
					}
					console.log(src + " => " + dest);
				}
			);
		}
		else
		{
			throw "Can't copy a tree containing this file";
		}
	}
}

console.log("Copying files to " + PROD_DIR);

copyDir(BUILD_DIR, PROD_DIR);
copyDir(PUBLIC_DIR, PROD_DIR);