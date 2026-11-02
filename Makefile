help:
	@echo "make setup - install code and dependencies"
	@echo "make check-pre-commit - trigger the pre-commit hooks on all files"

setup: setup-python setup-pre-commit

setup-python:
	@echo "Installing python virtual environment..."
	python3 -m venv venv
	. venv/bin/activate && python3 -m pip install --upgrade pip -r requirements.txt

setup-pre-commit:
	. venv/bin/activate && pre-commit install

check-pre-commit:
	. venv/bin/activate && pre-commit run -a

lint:
	terraform fmt -check -recursive
