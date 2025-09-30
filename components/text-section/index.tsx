import React from "react";
import styles from "./text-section.module.scss";

const TextSection = () => {
	return (
		<div className={styles.textSection}>
			<section className={styles.intro}>
				<h3>穿越化 · PRISMAEON</h3>
				<p>priz.me,i:.on (priz-muh-ee-on)</p>
				<p>打造一个穿越文化 - 国界 - 时间周期的品牌 & 大单品</p>
				<p>PRISM领英 独创的「穿越化 · 买点论」</p>
				<p>
					是系统化解决品牌&产品在全球化增长中的认知、审美与商业隔阂的方法论
					依托A级数据分析团队与统计学博士团队，结合海内外一线的创意设计力量，
					并由深耕多年的渠道认知及推，全方位洞察·解构·重塑您的品牌与产品
				</p>
			</section>
			<section className={styles.services}>
				<div className={styles.serviceItem}>
					<p className={styles.serviceTitle}>大数据分析 与 调研</p>
					<p className={styles.serviceTitle}>
						Data Analytics & Research
					</p>
					<p className={styles.serviceDesc}>
						品牌全方位调研与诊断、宏观市场洞察及本地化规划 \
						可行性评估
					</p>
				</div>
				<div className={styles.serviceItem}>
					<p className={styles.serviceTitle}>顶层战略架构与策划</p>
					<p className={styles.serviceTitle}>
						Strategy Architecture & Planning
					</p>
					<p className={styles.serviceDesc}>
						品牌产品架构与重塑 \ 商业模型设计 \ 市场进入策略 \
						合规化
					</p>
				</div>
				<div className={styles.serviceItem}>
					<p className={styles.serviceTitle}>
						品牌产品穿越化创意与设计
					</p>
					<p className={styles.serviceTitle}>
						Creative Directing & Design
					</p>
					<p className={styles.serviceDesc}>
						多维头脑风暴 \ 大单品爆款策划与设计 \
						文化与市场适配性重构
					</p>
				</div>
				<div className={styles.serviceItem}>
					<p className={styles.serviceTitle}>品牌穿越化感官系统</p>
					<p className={styles.serviceTitle}>Brand Sensory System</p>
					<p className={styles.serviceDesc}>
						感官商业用户心理学调研 \ 五感呈现梳理 \
						标志诊断:重构:优化\吉祥物设计\品牌口号
					</p>
				</div>
				<div className={styles.serviceItem}>
					<p className={styles.serviceTitle}>穿越化产品包装设计</p>
					<p className={styles.serviceTitle}>
						Product Packaging Design
					</p>
					<p className={styles.serviceDesc}>
						包装策略 \ 包装设计 \ 材料资源 \ 工业设计 \ 爆款研究
					</p>
				</div>
				<div className={styles.serviceItem}>
					<p className={styles.serviceTitle}>新媒体定制运维服务</p>
					<p className={styles.serviceTitle}>
						New Media Customization & Operation
					</p>
					<p className={styles.serviceDesc}>
						品牌数字化整合营销传播 \ WEB3D品牌国际官网定制 \
						海外自媒体孵化与运维
					</p>
				</div>
				<div className={styles.serviceItem}>
					<p className={styles.serviceTitle}>穿越化IP创造及授权</p>
					<p className={styles.serviceTitle}>
						IP Creation & Licensing
					</p>
					<p className={styles.serviceDesc}>
						IP孵化与开发 \ IP授权与管理 \ IP传播与营销 \
						IP供应链与渠道
					</p>
				</div>
				<div className={styles.serviceItem}>
					<p className={styles.serviceTitle}>穿越化视觉</p>
					<p className={styles.serviceTitle}>Visualization</p>
					<p className={styles.serviceDesc}>
						企业宣传片 \ 全域整合传播 \ TVC广告制作 \ 3A版CG \
						海外UGC矩阵 \ 海报设计
					</p>
				</div>
				<div className={styles.serviceItem}>
					<p className={styles.serviceTitle}>策略推广</p>
					<p className={styles.serviceTitle}>Strategy Promotion</p>
					<p className={styles.serviceDesc}>
						主题事件营销 \ 市场策略规划 \ 社交媒体营销 \ 海外KOL矩阵
						\ 投资及方案 \ 线上线下渠道整合
					</p>
				</div>
			</section>
		</div>
	);
};

export default TextSection;
