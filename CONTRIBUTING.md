# Contribute to the project

## Pre-requisite
* an unix environment (linux, macos, wsl, etc...)
* **python3**, **python3-venv** and **python3-pip** are installed
* **Make** is installed

You should also think about setting up a global `.gitignore` for ide-related files.

```
git config --global core.excludesFile '~/.gitignore'
```

Add your IDE configuration folder in that gitignore file:

```
cat ~/.gitignore <<EOF
.vscode # VSCode IDE
.idea # Jetbrains IDE
EOF
```


## Setup your environment
```
make setup
```

This command create a python virtual environment and install required dependencies including pre-commit which is automatically enabled.


## Pre-commit
Pre-commit is a tool that allow to run a git pre-commit hook using community defined rules.

Using pre-commit ensures that everyones follow a common set of pre-defined practices.

### Default pre-commit checks enabled

#### Terraform Related checks
The following commands are run on files within the `iac/` folder:
* `terraform_fmt`: executes the `terraform fmt` command.
* `terraform_validate`: executes the `terraform validate` command.
Requires an initialized terraform project. If no backend is defined yet you may use `terraform init -backend=false`.
* `terraform_checkov`: executes [**checkov**](https://github.com/bridgecrewio/checkov) on the iac code (works on terraform and aws cdk). Checkov was chosen over tfsec or trivy since it is easily installable through pip and known for its precise recommandation aligning with the [**AWS Well-Architected framework**](https://aws.amazon.com/architecture/well-architected/).

#### General checks

* `check-added-large-files`: checks for files that are larger than **500kb**. For larger files please use `git-lfs` if possible.
* `end-of-file-fixer`: Keeps only a single empty line at the end of each file.
* `trailing-whitespace`: Removes trailing whitespaces at the end of the line of each files.
* `no-commit-to-branch`: Blocks commiting directly to the `main`/`master` branch.
* `requirements-txt-fixer`: Re-order the package within the python `requirements.txt` file by alphabetical order.


## Github Actions

The default github action workflow is run on **Pull Request** creation to the `main` branch of the project when there is an update to terraform files.

It executes the same terraform checks that are ran through pre-commit to ensure consistency and deny potential bypass.

It also auto-generate terraform documentation and inject it into the `iac/README.md` file thanks to [`terraform-docs`](https://github.com/terraform-docs/terraform-docs).


## Github Issues

Templates were created for bug and feature issues, these should be used and updated to match the current project.

There is also documentation templates available within the `documentation/` folder that can help to structure:
* [Architectural choices and challenges](./documentation/00_architectural-guidance-template.md)
* [FAQ](./documentation/00_faq-template.md)
* [Procedures](./documentation/00_procedure-template.md)
