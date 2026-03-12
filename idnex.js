const express = require('express');
const { Pool } = require('pg');
const app = express();

// Render가 부여하는 포트 또는 기본 3000번 포트 사용
const PORT = process.env.PORT || 3000;

// Neon 데이터베이스 연결 설정
// SSL 설정(ssl: true)은 Neon과 같은 클라우드 DB 접속 시 필수입니다.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.get('/', async (req, res) => {
  try {
    // test 테이블에서 name 컬럼 하나를 가져오는 SQL문
    // (데이터가 여러 개일 경우를 대비해 LIMIT 1 추가)
    const result = await pool.query('SELECT name FROM test LIMIT 1');
    
    if (result.rows.length > 0) {
      const userName = result.rows[0].name;
      res.send(`<h1>HELLO ${userName}</h1>`);
    } else {
      res.send('<h1>데이터가 없습니다! 테이블에 레코드를 추가해주세요.</h1>');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('DB 연결 오류가 발생했습니다.');
  }
});

app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
