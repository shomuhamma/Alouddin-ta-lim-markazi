import os
import csv
import math
import sqlite3
import html
import logging
from datetime import datetime, date
from typing import List, Tuple

from openpyxl import Workbook

from telegram import (
    Update,
    InlineKeyboardButton,
    InlineKeyboardMarkup,
    InputFile,
)
from telegram.constants import ParseMode
from telegram.ext import (
    Application,
    CommandHandler,
    CallbackQueryHandler,
    ContextTypes,
    MessageHandler,
    filters,
)

# -------------------- LOGGING --------------------
logging.basicConfig(level=logging.INFO)

# -------------------- CONFIG --------------------
BOT_TOKEN = "8330411414:AAF8U0h-5au0ZY8MhhzYtRCgWWT53hoTyYQ"

# Admin Telegram ID lar ro'yxati
ADMIN_IDS = {8330411414, 5490555893}

# db.sqlite3 fayl joylashgan yo'l
DB_PATH = "./db.sqlite3"

# Django media papkasi (manage.py yonida media bor deb olamiz)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MEDIA_ROOT = os.path.join(BASE_DIR, "media")

PAGE_SIZE = 5

COURSE_TABLE = "applications_courseapplication"
VACANCY_TABLE = "applications_vacancyapplication"

ALLOWED_TABLES = {COURSE_TABLE, VACANCY_TABLE}

# Callback actionlar
ACT_MENU = "menu"
ACT_LIST = "list"
ACT_PAGE = "page"
ACT_EXPORT = "export"
ACT_CERT = "cert"
ACT_STATS = "stats"


# -------------------- HELPERS --------------------
def h(text: str) -> str:
    """Telegram HTML parse uchun xavfsiz text."""
    return html.escape(str(text) if text is not None else "")


def is_admin(user_id: int) -> bool:
    return user_id in ADMIN_IDS


def deny_text() -> str:
    return "❌ Kechirasiz, bu bo‘lim faqat admin uchun."


# -------------------- DB HELPERS --------------------
def db_connect():
    # timeout qo'yamiz (lock bo'lsa kutadi)
    conn = sqlite3.connect(DB_PATH, timeout=30)
    conn.row_factory = sqlite3.Row
    return conn


def safe_table(table: str) -> bool:
    return table in ALLOWED_TABLES


def count_rows(table: str, where_sql: str = "", params: Tuple = ()) -> int:
    conn = db_connect()
    cur = conn.cursor()
    q = f"SELECT COUNT(*) AS cnt FROM {table} {where_sql}"
    cur.execute(q, params)
    total = cur.fetchone()["cnt"]
    conn.close()
    return int(total)


def fetch_rows(table: str, offset: int, limit: int, where_sql: str = "", params: Tuple = ()):
    conn = db_connect()
    cur = conn.cursor()
    q = f"""
        SELECT * FROM {table}
        {where_sql}
        ORDER BY datetime(created_at) DESC
        LIMIT ? OFFSET ?
    """
    cur.execute(q, (*params, limit, offset))
    rows = cur.fetchall()
    conn.close()
    return rows


def fetch_one(table: str, row_id: int):
    conn = db_connect()
    cur = conn.cursor()
    cur.execute(f"SELECT * FROM {table} WHERE id = ?", (row_id,))
    row = cur.fetchone()
    conn.close()
    return row


def today_stats(table: str) -> Tuple[int, int]:
    conn = db_connect()
    cur = conn.cursor()

    cur.execute(f"SELECT COUNT(*) AS cnt FROM {table}")
    total = int(cur.fetchone()["cnt"])

    today_str = date.today().isoformat()
    cur.execute(f"SELECT COUNT(*) AS cnt FROM {table} WHERE substr(created_at, 1, 10) = ?", (today_str,))
    today_cnt = int(cur.fetchone()["cnt"])

    conn.close()
    return today_cnt, total


# -------------------- UI HELPERS --------------------
def main_menu_kb() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup([
        [InlineKeyboardButton("📘 Kurs arizalari", callback_data=f"{ACT_LIST}:{COURSE_TABLE}:0")],
        [InlineKeyboardButton("💼 Vakansiya arizalari", callback_data=f"{ACT_LIST}:{VACANCY_TABLE}:0")],
        [InlineKeyboardButton("📊 Statistika", callback_data=f"{ACT_STATS}:all")],
    ])


def list_footer_kb(table: str, page: int, total: int, query: str = "") -> InlineKeyboardMarkup:
    max_page = max(0, math.ceil(total / PAGE_SIZE) - 1)
    page = max(0, min(page, max_page))

    q_safe = query.replace(":", " ")[:80]
    prev_page = max(0, page - 1)
    next_page = min(max_page, page + 1)

    row1 = [
        InlineKeyboardButton("⬅️ Oldingi", callback_data=f"{ACT_PAGE}:{table}:{prev_page}:{q_safe}"),
        InlineKeyboardButton(f"📄 {page + 1}/{max_page + 1}", callback_data=f"{ACT_MENU}:noop"),
        InlineKeyboardButton("Keyingi ➡️", callback_data=f"{ACT_PAGE}:{table}:{next_page}:{q_safe}"),
    ]

    row2 = [
        InlineKeyboardButton("🔎 Qidirish", callback_data=f"{ACT_MENU}:searchhelp"),
        InlineKeyboardButton("📥 Export CSV", callback_data=f"{ACT_EXPORT}:csv:{table}:{q_safe}"),
        InlineKeyboardButton("📥 Export XLSX", callback_data=f"{ACT_EXPORT}:xlsx:{table}:{q_safe}"),
    ]

    row3 = [InlineKeyboardButton("⬅️ Menyu", callback_data=f"{ACT_MENU}:home")]

    return InlineKeyboardMarkup([row1, row2, row3])


def course_where(query: str) -> Tuple[str, Tuple]:
    if not query:
        return "", ()
    like = f"%{query}%"
    where = "WHERE full_name LIKE ? OR phone LIKE ? OR subject LIKE ? OR lesson_day LIKE ?"
    return where, (like, like, like, like)


def vacancy_where(query: str) -> Tuple[str, Tuple]:
    if not query:
        return "", ()
    like = f"%{query}%"
    where = "WHERE full_name LIKE ? OR phone LIKE ? OR gender LIKE ? OR about LIKE ?"
    return where, (like, like, like, like)


def build_where(table: str, query: str) -> Tuple[str, Tuple]:
    if table == COURSE_TABLE:
        return course_where(query)
    return vacancy_where(query)


def fmt_course_rows(rows) -> str:
    if not rows:
        return "Hozircha ma’lumot yo‘q."
    out = ["📘 <b>Kursga arizalar</b>"]
    for r in rows:
        out.append(
            "\n"
            f"🆔 <b>{h(r['id'])}</b>\n"
            f"👤 {h(r['full_name'])}\n"
            f"📞 <code>{h(r['phone'])}</code>\n"
            f"📚 {h(r['subject'])}\n"
            f"📅 {h(r['lesson_day'])}\n"
            f"🕒 {h(r['created_at'])}"
        )
    return "\n".join(out)


def fmt_vacancy_rows(rows) -> str:
    if not rows:
        return "Hozircha ma’lumot yo‘q."
    out = ["💼 <b>Vakansiya arizalari</b>"]
    for r in rows:
        cert = r["certificates"] if "certificates" in r.keys() else ""
        cert_line = f"\n📎 Sertifikat: <code>{h(cert)}</code>" if cert else ""
        out.append(
            "\n"
            f"🆔 <b>{h(r['id'])}</b>\n"
            f"👤 {h(r['full_name'])}\n"
            f"📞 <code>{h(r['phone'])}</code>\n"
            f"🚻 {h(r['gender'])}\n"
            f"🎂 {h(r['birth_date'])}\n"
            f"📝 {h(r['about'])}{cert_line}\n"
            f"🕒 {h(r['created_at'])}"
        )
    return "\n".join(out)


def add_cert_buttons_if_needed(table: str, rows, base_kb: InlineKeyboardMarkup) -> InlineKeyboardMarkup:
    if table != VACANCY_TABLE or not rows:
        return base_kb

    extra = []
    for r in rows:
        cert = r["certificates"] if "certificates" in r.keys() else ""
        if cert:
            extra.append(
                InlineKeyboardButton(f"📎 Sertifikat #{r['id']}", callback_data=f"{ACT_CERT}:{table}:{r['id']}")
            )

    if not extra:
        return base_kb

    rows_btn = []
    for i in range(0, len(extra), 2):
        rows_btn.append(extra[i:i + 2])

    return InlineKeyboardMarkup(rows_btn + list(base_kb.inline_keyboard))


# -------------------- EXPORT HELPERS --------------------
def get_table_columns(table: str) -> List[str]:
    conn = db_connect()
    cur = conn.cursor()
    cur.execute(f"PRAGMA table_info({table})")
    cols = [row[1] for row in cur.fetchall()]
    conn.close()
    return cols


def export_csv(table: str, query: str, filepath: str) -> str:
    where_sql, params = build_where(table, query)
    total = count_rows(table, where_sql, params)
    rows = fetch_rows(table, 0, total if total > 0 else 1, where_sql, params)

    headers = get_table_columns(table)
    with open(filepath, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(headers)
        for r in rows:
            w.writerow([r[h] if h in r.keys() else "" for h in headers])
    return filepath


def export_xlsx(table: str, query: str, filepath: str) -> str:
    where_sql, params = build_where(table, query)
    total = count_rows(table, where_sql, params)
    rows = fetch_rows(table, 0, total if total > 0 else 1, where_sql, params)

    wb = Workbook()
    ws = wb.active
    ws.title = "data"

    headers = get_table_columns(table)
    ws.append(headers)
    for r in rows:
        ws.append([r[h] if h in r.keys() else "" for h in headers])

    wb.save(filepath)
    return filepath


# -------------------- HANDLERS --------------------
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    if not user or not is_admin(user.id):
        await update.message.reply_text(deny_text())
        return

    text = "✅ <b>Admin panel</b>\n\nQuyidagi bo‘limlardan birini tanlang:"
    await update.message.reply_text(text, parse_mode=ParseMode.HTML, reply_markup=main_menu_kb())


async def help_cmd(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    if not user or not is_admin(user.id):
        await update.message.reply_text(deny_text())
        return

    await update.message.reply_text(
        "🧭 <b>Buyruqlar:</b>\n"
        "/start — menyu\n"
        "/course — kurs arizalari\n"
        "/vacancy — vakansiya arizalari\n"
        "/find so'z — qidirish (oxirgi ochilgan bo‘limda)\n"
        "/stats — statistika\n\n"
        "🔎 <b>Qidirish misol:</b>\n"
        "<code>/find +998</code> yoki <code>/find Shom</code> yoki <code>/find backend</code>",
        parse_mode=ParseMode.HTML
    )


async def course_cmd(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await show_list(update, context, table=COURSE_TABLE, page=0, query="")


async def vacancy_cmd(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await show_list(update, context, table=VACANCY_TABLE, page=0, query="")


async def stats_cmd(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    if not user or not is_admin(user.id):
        await update.message.reply_text(deny_text())
        return

    c_today, c_total = today_stats(COURSE_TABLE)
    v_today, v_total = today_stats(VACANCY_TABLE)

    await update.message.reply_text(
        "📊 <b>Statistika</b>\n\n"
        f"📘 Kurs arizalari: bugun <b>{c_today}</b>, jami <b>{c_total}</b>\n"
        f"💼 Vakansiya arizalari: bugun <b>{v_today}</b>, jami <b>{v_total}</b>",
        parse_mode=ParseMode.HTML,
        reply_markup=main_menu_kb()
    )


async def find_cmd(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    if not user or not is_admin(user.id):
        await update.message.reply_text(deny_text())
        return

    if not context.args:
        await update.message.reply_text("🔎 Qidirish uchun: <code>/find so'z</code>", parse_mode=ParseMode.HTML)
        return

    query = " ".join(context.args).strip()
    table = context.user_data.get("last_table", COURSE_TABLE)
    await show_list(update, context, table=table, page=0, query=query)


async def show_list(update_or_query, context: ContextTypes.DEFAULT_TYPE, table: str, page: int, query: str):
    user = update_or_query.effective_user
    if not user or not is_admin(user.id):
        if hasattr(update_or_query, "callback_query") and update_or_query.callback_query:
            await update_or_query.callback_query.answer("Ruxsat yo‘q.", show_alert=True)
        else:
            await update_or_query.message.reply_text(deny_text())
        return

    if not safe_table(table):
        if hasattr(update_or_query, "callback_query") and update_or_query.callback_query:
            await update_or_query.callback_query.answer("Noto‘g‘ri jadval.", show_alert=True)
        else:
            await update_or_query.message.reply_text("Noto‘g‘ri jadval.")
        return

    context.user_data["last_table"] = table
    context.user_data["last_query"] = query

    where_sql, params = build_where(table, query)
    total = count_rows(table, where_sql, params)
    max_page = max(0, math.ceil(total / PAGE_SIZE) - 1)
    page = max(0, min(page, max_page))

    offset = page * PAGE_SIZE
    rows = fetch_rows(table, offset, PAGE_SIZE, where_sql, params)

    text = fmt_course_rows(rows) if table == COURSE_TABLE else fmt_vacancy_rows(rows)

    if query:
        text += f"\n\n🔎 Qidiruv: <b>{h(query)}</b>  |  Natija: <b>{total}</b>"
    else:
        text += f"\n\nJami: <b>{total}</b>"

    kb = list_footer_kb(table, page, total, query=query)
    kb = add_cert_buttons_if_needed(table, rows, kb)

    if hasattr(update_or_query, "callback_query") and update_or_query.callback_query:
        cq = update_or_query.callback_query
        await cq.message.edit_text(text, parse_mode=ParseMode.HTML, reply_markup=kb)
        await cq.answer()
    else:
        await update_or_query.message.reply_text(text, parse_mode=ParseMode.HTML, reply_markup=kb)


async def callbacks(update: Update, context: ContextTypes.DEFAULT_TYPE):
    cq = update.callback_query
    user = update.effective_user
    if not cq:
        return

    if not user or not is_admin(user.id):
        await cq.answer("Ruxsat yo‘q.", show_alert=True)
        return

    data = cq.data or ""
    parts = data.split(":")

    if parts[0] == ACT_MENU:
        if len(parts) > 1 and parts[1] == "home":
            await cq.message.edit_text(
                "✅ <b>Admin panel</b>\n\nQuyidagi bo‘limlardan birini tanlang:",
                parse_mode=ParseMode.HTML,
                reply_markup=main_menu_kb()
            )
            await cq.answer()
            return

        if len(parts) > 1 and parts[1] == "searchhelp":
            await cq.answer()
            await cq.message.reply_text(
                "🔎 <b>Qidirish:</b>\n"
                "1) <code>/find so'z</code> yozing\n"
                "2) natija sahifasida qidirishingiz mumkin\n\n"
                "Misol:\n"
                "<code>/find +998</code>  |  <code>/find Shom</code>  |  <code>/find backend</code>",
                parse_mode=ParseMode.HTML
            )
            return

        await cq.answer()
        return

    if parts[0] == ACT_LIST:
        table = parts[1]
        page = int(parts[2]) if len(parts) > 2 else 0
        await show_list(update, context, table=table, page=page, query="")
        return

    if parts[0] == ACT_PAGE:
        table = parts[1]
        page = int(parts[2])
        query = parts[3] if len(parts) > 3 else ""
        await show_list(update, context, table=table, page=page, query=query.strip())
        return

    if parts[0] == ACT_EXPORT:
        fmt = parts[1]
        table = parts[2]
        query = parts[3] if len(parts) > 3 else ""
        query = query.strip()

        if not safe_table(table):
            await cq.answer("Noto‘g‘ri jadval.", show_alert=True)
            return

        os.makedirs("exports", exist_ok=True)
        stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        base = f"exports/{table}_{stamp}"

        await cq.answer("📥 Tayyorlayapman...")

        if fmt == "csv":
            path = export_csv(table, query, base + ".csv")
        else:
            path = export_xlsx(table, query, base + ".xlsx")

        caption = f"📥 Export: {table}"
        if query:
            caption += f"\n🔎 Qidiruv: {query}"

        filename = os.path.basename(path)

        await cq.message.reply_document(
            document=InputFile(path, filename=filename),
            caption=caption
        )
        return


    if parts[0] == ACT_CERT:
        table = parts[1]
        row_id = int(parts[2])

        if table != VACANCY_TABLE:
            await cq.answer("Sertifikat faqat vakansiya jadvalida.", show_alert=True)
            return

        row = fetch_one(table, row_id)
        if not row:
            await cq.answer("Topilmadi.", show_alert=True)
            return

        cert_rel = row["certificates"] if "certificates" in row.keys() else ""
        if not cert_rel:
            await cq.answer("Sertifikat yo‘q.", show_alert=True)
            return

        # media/<cert_rel>
        cert_path = cert_rel
        if not os.path.isabs(cert_path):
            cert_path = os.path.join(MEDIA_ROOT, cert_rel)
        cert_path = os.path.normpath(cert_path)

        if not os.path.exists(cert_path):
            await cq.answer(f"Sertifikat topilmadi:\n{cert_path}", show_alert=True)
            return

        await cq.answer()

        caption = f"📎 Sertifikat (ID: {row_id})\n👤 {row['full_name']}\n📞 {row['phone']}"

        ext = os.path.splitext(cert_path)[1].lower()
        filename = os.path.basename(cert_path)

        # ✅ Rasm bo'lsa — photo yuboramiz (Telegramda bosib ochiladi)
        if ext in [".jpg", ".jpeg", ".png", ".webp"]:
            with open(cert_path, "rb") as f:
                await cq.message.reply_photo(
                    photo=InputFile(f, filename=filename),
                    caption=caption
                )
        else:
            # ✅ PDF/DOC bo'lsa — document, lekin filename bilan
            with open(cert_path, "rb") as f:
                await cq.message.reply_document(
                    document=InputFile(f, filename=filename),
                    caption=caption
                )
        return


    if parts[0] == ACT_STATS:
        await cq.answer()
        c_today, c_total = today_stats(COURSE_TABLE)
        v_today, v_total = today_stats(VACANCY_TABLE)

        await cq.message.reply_text(
            "📊 <b>Statistika</b>\n\n"
            f"📘 Kurs arizalari: bugun <b>{c_today}</b>, jami <b>{c_total}</b>\n"
            f"💼 Vakansiya arizalari: bugun <b>{v_today}</b>, jami <b>{v_total}</b>",
            parse_mode=ParseMode.HTML
        )
        return

    await cq.answer()


# -------------------- RUN --------------------
def main():
    if not os.path.exists(DB_PATH):
        raise FileNotFoundError(f"DB topilmadi: {DB_PATH}")

    app = Application.builder().token(BOT_TOKEN).build()

    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("help", help_cmd))
    app.add_handler(CommandHandler("course", course_cmd))
    app.add_handler(CommandHandler("vacancy", vacancy_cmd))
    app.add_handler(CommandHandler("stats", stats_cmd))
    app.add_handler(CommandHandler("find", find_cmd))

    app.add_handler(CallbackQueryHandler(callbacks))

    async def fallback(update: Update, context: ContextTypes.DEFAULT_TYPE):
        user = update.effective_user
        if user and is_admin(user.id):
            await update.message.reply_text("Yordam: /help")
        else:
            await update.message.reply_text(deny_text())

    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, fallback))

    print("✅ Bot ishga tushdi...")
    app.run_polling(close_loop=False)


if __name__ == "__main__":
    main()