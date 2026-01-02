import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

export class SearchConfig {
  private static config: any = null;

  private static getConfig() {
    if (this.config) return;
    try {
      const filePath = path.join(__dirname, '../../config/search_config.yml');
      this.config = yaml.load(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
      console.error("Could not parse search_config YAML", e);
    }
  }

  static getHelpUrl(): string {
    this.getConfig();
    return this.config?.help_url || "";
  }

  static getLearningObjectUrl(lo: any): string {
    this.getConfig();
    if (!this.config || !lo) return "";
    
    let result = this.config.learning_object_url;
    if (!result) return "";

    if (lo.projects) {
       result = result.replace('$project_url$', lo.projects.url)
                      .replace('$project_name$', lo.projects.name);
    }
    result = result.replace('$lo_exuid$', lo.exuid).replace(/ /g, '_');
    return result;
  }
}
