var Generator = require("yeoman-generator");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.option("babel");
  }

  async prompting() {
    this.answers = await this.prompt([
      {
        type: "input",
        name: "name",
        message: "Project name?",
        default: this.appname,
      },
      {
        type: "confirm",
        name: "eslint",
        message: "Would you like to add ESLint?",
        default: true,
      },
      {
        type: "confirm",
        name: "prettier",
        message: "What about Prettier?",
        default: true,
      },
    ]);
  }

  writing() {
    this._copyPackageJson();
    this._copyNpmRc();
    this._copyNodemonConfig();
    this._copyGitignore();
    this._copyTsconfig();

    this._copyESLintConfigIfSelected();
    this._copyPrettierConfigIfSelected();

    this._copySrc();
  }

  _copyPackageJson() {
    this.fs.copyTpl(
      this.templatePath("package.json"),
      this.destinationPath("package.json"),
      { appname: this.answers.name }
    );
  }

  _copyNpmRc() {
    this.fs.copyTpl(
      this.templatePath("dot-npmrc"),
      this.destinationPath(".npmrc")
    );
  }

  _copyNodemonConfig() {
    this.fs.copyTpl(
      this.templatePath("nodemon.json"),
      this.destinationPath("nodemon.json")
    );
  }

  _copyGitignore() {
    this.fs.copyTpl(
      this.templatePath("dot-gitignore"),
      this.destinationPath(".gitignore")
    );
  }

  _copyTsconfig() {
    this.fs.copyTpl(
      this.templatePath("tsconfig.json"),
      this.destinationPath("tsconfig.json")
    );
  }

  _copyESLintConfigIfSelected() {
    if (this.answers.eslint) {
      this.fs.copyTpl(
        this.templatePath("dot-eslintrc"),
        this.destinationPath(".eslintrc")
      );
    }
  }

  _copyPrettierConfigIfSelected() {
    if (this.answers.prettier) {
      this.fs.copyTpl(
        this.templatePath("dot-prettierrc"),
        this.destinationPath(".prettierrc")
      );
    }
  }

  _copySrc() {
    this.fs.copyTpl(
      this.templatePath("src/index.ts"),
      this.destinationPath("src/index.ts")
    );
  }

  install() {
    const dependencies = [
      "@types/node@^14.14.16",
      "nodemon@^2.0.6",
      "ts-node@^9.1.1",
      "typescript@^4.1.3",
    ];

    if (this.answers.eslint) {
      dependencies.push(
        "@typescript-eslint/eslint-plugin@^4.11.0",
        "@typescript-eslint/parser@^4.11.0",
        "eslint"
      );
    }

    this.npmInstall(dependencies, { "save-dev": true });
  }
};
