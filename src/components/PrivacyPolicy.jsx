import styles from '../styles/components/PrivacyPolicy.module.css'
import projectsData from '../data/projects.json'

function PrivacyPolicy() {
  const { social } = projectsData

  return (
    <main className={styles.policy}>
      <header className={styles.hero}>
        <h2>개인정보처리방침</h2>
        <p>
          evanyi(이하 “서비스”)는 이용자의 개인정보를 소중히 다루며, 관련 법령을
          준수합니다. 본 방침은 서비스에서 어떤 정보를 수집하고 어떻게 사용하며
          보호하는지에 대해 안내합니다.
        </p>
        <p className={styles.meta}>시행일: 2026년 1월 18일</p>
      </header>

      <section className={styles.section}>
        <h3>1. 수집하는 개인정보 항목</h3>
        <ul className={styles.list}>
          <li>문의 시: 이메일 주소, 이름(선택), 문의 내용</li>
          <li>자동 수집: 접속 로그, IP 주소, 브라우저/기기 정보, 쿠키 정보</li>
        </ul>
        <p className={styles.note}>
          서비스는 회원가입이나 결제 기능을 제공하지 않으며, 이메일 문의를 통해서만
          개인정보가 전달될 수 있습니다.
        </p>
      </section>

      <section className={styles.section}>
        <h3>2. 개인정보 이용 목적</h3>
        <ul className={styles.list}>
          <li>문의 응대 및 커뮤니케이션</li>
          <li>서비스 운영 및 보안, 품질 개선</li>
          <li>법령 준수 및 분쟁 대응</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h3>3. 보유 및 이용 기간</h3>
        <p>
          개인정보는 수집 및 이용 목적이 달성되면 지체 없이 파기합니다. 다만, 관련
          법령에 따라 보관이 필요한 경우 해당 기간 동안 보관할 수 있습니다.
        </p>
      </section>

      <section className={styles.section}>
        <h3>4. 제3자 제공 및 처리 위탁</h3>
        <p>
          서비스는 원칙적으로 개인정보를 제3자에게 제공하지 않습니다. 다만, 안정적인
          서비스 운영을 위해 호스팅/인프라 제공자에게 일부 정보가 처리될 수 있으며,
          이 경우 필요한 최소 범위로 제한합니다.
        </p>
      </section>

      <section className={styles.section}>
        <h3>5. 이용자의 권리</h3>
        <ul className={styles.list}>
          <li>개인정보 열람, 정정, 삭제, 처리 정지 요청</li>
          <li>동의 철회 및 문의 내용 삭제 요청</li>
        </ul>
        <p className={styles.note}>
          관련 요청은 아래 문의처로 연락주시면 지체 없이 조치하겠습니다.
        </p>
      </section>

      <section className={styles.section}>
        <h3>6. 쿠키 및 로그 정보</h3>
        <p>
          서비스는 원활한 운영과 보안을 위해 쿠키 및 접속 로그를 사용할 수 있습니다.
          이용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있으나, 일부 기능이
          제한될 수 있습니다.
        </p>
      </section>

      <section className={styles.section}>
        <h3>7. 개인정보 보호를 위한 조치</h3>
        <p>
          서비스는 개인정보 보호를 위해 접근 통제, 암호화 통신(HTTPS), 내부 관리
          절차 등 합리적인 보호 조치를 적용합니다.
        </p>
      </section>

      <section className={styles.section}>
        <h3>8. 문의처</h3>
        <p>
          개인정보 관련 문의는 다음 이메일로 연락해 주세요: {social.email}
        </p>
      </section>

      <section className={styles.section}>
        <h3>9. 방침 변경</h3>
        <p>
          본 방침은 관련 법령 또는 서비스 변경에 따라 수정될 수 있으며, 변경 시
          페이지를 통해 고지합니다.
        </p>
      </section>
    </main>
  )
}

export default PrivacyPolicy
