const path = require('path');
const { gulp, gulpZip, task,  uploadOtaPack } = require('@ubt/gulp-helper');
const pkg = require('./package.json');

const DIST_DIR = 'dist';
const TEMP_DIR = 'upload-temp';
const zipName = 'ai-paas-platform.zip';
const ZIP_WEB_PATH = path.join(TEMP_DIR, zipName);
const repoName = 'ai-paas-platform';

const appEnv = process.env.ENVCONGIG || 'test';

function getVersionName() {
  return process.env.VERSION || pkg.version;
}

function getBuildTime() {
  // 保持上传nexus与上传到web服务器名称一致
  if (process.env.BUILD_TIME) {
    return process.env.BUILD_TIME;
  }
  const time = new Date();
  return `${time.getFullYear()}_${time.getMonth() + 1}_${time.getDate()}_${time.getHours()}_${time.getMinutes()}`;
}

function getRepoDirName() {
  return `${repoName}/${appEnv}/${getVersionName()}`;
}

const compressZip = () => {
  let files = [`${DIST_DIR}/**/*`];
  return gulp.src(files).pipe(gulpZip(ZIP_WEB_PATH)).pipe(gulp.dest('./'));
};

const uploadZip = async (done) => {
  const versionNum = getVersionName();
  const zipSuffixName = `v${versionNum}-t${getBuildTime()}-${appEnv}`;
  const targetFilePath = `${getRepoDirName()}/${getBuildTime()}`;
  const targetFileName = `ai-paas-platform-${zipSuffixName}`;
  const webZipFile = `${targetFilePath}/${targetFileName}.zip`;
  const url = await uploadOtaPack(ZIP_WEB_PATH, repoName, {
    targetFile: webZipFile,
    appEnv,
  });
  console.log(url)
  done();
};

task('zip', compressZip, '压缩 web 包');
task('upload', gulp.series('zip', uploadZip), '上传压缩包到nexus');