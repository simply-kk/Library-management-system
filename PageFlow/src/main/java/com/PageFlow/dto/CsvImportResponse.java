package com.PageFlow.dto;

import java.util.List;

public class CsvImportResponse {

	private int importedCount;

	private int skippedCount;

	private List<String> errors;

	public int getImportedCount() {
		return importedCount;
	}

	public void setImportedCount(int importedCount) {
		this.importedCount = importedCount;
	}

	public int getSkippedCount() {
		return skippedCount;
	}

	public void setSkippedCount(int skippedCount) {
		this.skippedCount = skippedCount;
	}

	public List<String> getErrors() {
		return errors;
	}

	public void setErrors(List<String> errors) {
		this.errors = errors;
	}

}