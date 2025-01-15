import safeSiteIcon from '@/assets/images/common/safe_label.png';
import ai from '@/assets/images/home/footer_ai.png';
import phone from '@/assets/images/home/footer_phone_icon.png';
import email from '@/assets/images/home/footer_email_icon.png';
import qrcode from '@/assets/images/home/qrcode.png';

import styles from './index.module.less';

const FooterLayout: React.FC = () => (
  <div className={styles.footer_wrap}>
    <div className={styles.nav_cont_wrap}>
      <div className="container_cont">
        <div className={styles.nav_wrap_box}>
          <img src={ai} className={styles.ai} />
          <div className={styles.contact}>
            <div className={styles.title}>联系我们</div>
            <div className={styles.cont}>
              <img src={phone} className={styles.phone} />
              400-6666-700
              <img src={email} className={styles.email} />
              jiang.jiang@ubtrobot.com
            </div>
          </div>
          <img src={qrcode} className={styles.qrcode} />
        </div>
      </div>
    </div>
    <div className={styles.attent_tip_wrap}>
      <div className="container_cont">
        <ul className={styles.cont_list}>
          <li>©2012-2021 Ubtech Robotics Corp. All Right Reserved</li>
          <li>
            <a
              href="https://www.ubtrobot.com/cn/private-policy"
              target="_blank"
            >
              隐私政策
            </a>
            &nbsp;&nbsp;
            <a href="https://www.ubtrobot.com/cn/legal" target="_blank">
              使用条款
            </a>
          </li>
          <li className={styles.safe_site_cont}>
            <img src={safeSiteIcon} alt="" />
            <a href="http://beian.miit.gov.cn/" target="_blank">
              粤ICP备13036544号
            </a>
            &nbsp;
            <span>深圳市优必选科技股份有限公司</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
);

export default FooterLayout;
