// data/translations.js
// Single source of bilingual text for the whole site: entry content
// translations (km.entry1..entry8) plus interface strings for both
// languages (en.ui / km.ui) — nav labels, buttons, search placeholder,
// footer credit, the landing page copy, AND the archive's own
// name/description/source (collection.config.js stays the single
// English source for those three fields; the km versions below are
// the override shown when Khmer is active).
//
// NOTE: everything below is AI-drafted. This batch specifically now
// includes the archive's own title and description — please have a
// native speaker (e.g. a family member) proofread all of it, and this
// batch especially, before treating it as final.

const translations = {
  en: {
    ui: {
      nav_home: "Home",
      nav_entries: "Entries",
      search_placeholder: "Search by title, description, or keyword — English or Khmer",
      no_results: "No entries match your search.",
      back_to_entries: "Back to entries",
      curated_by: "Curated by",
      source_label: "Source",
      contributor_label: "Contributor",
      place_label: "Place",
      entries_count_prefix: "Entries in the archive:",
      entries_count_suffix: "(for now)",
      hero_kicker: "Khmer Living Archive",
      cta_button: "Explore the Archive",
      footer_credit:
        "Built in ICT 340 — Vibe Coding, American University of Phnom Penh, Fall 2026. This archive is under construction all semester. Come back in December.",
      landing_intro: [
        "Choul Chnam Thmey — the Khmer New Year — arrives every mid-April, timed to the end of the harvest season and rooted in centuries of Theravada Buddhist tradition. Over three days, families welcome a new guardian spirit, visit the pagoda to make offerings, and gather to wash away the past year's misfortune with cleansing water poured over Buddha statues and elders alike.",
        "This archive holds one family's version of that rhythm: the altar my mother sets each year, the noodles she cooks for luck, the games played on the first night, the songs passed down. None of it comes from a textbook — it comes from watching, helping, and asking questions across a lot of April afternoons.",
      ],
    },
  },
  km: {
    entry1: {
      title: "ការទទួលទេវតាឆ្នាំថ្មី",
      description:
        "មុនថ្ងៃទី១នៃពិធីបុណ្យចូលឆ្នាំថ្មីខ្មែរ ក្រុមគ្រួសាររបស់ខ្ញុំរៀបចំតុបូជាមួយផ្លែឈើស្រស់ ធូប និងទៀន ដើម្បីទទួលទេវតា ដែលជាទេវតារក្សាដែលគេជឿថានឹងមកយាមមើលថែផ្ទះរបស់យើងអស់មួយឆ្នាំខាងមុខ។ យើងប្រមូលផ្តុំគ្នាដុតធូបជាមួយគ្នា ហើយប្រាថ្នាសម្រាប់ឆ្នាំថ្មី ជាពេលវេលាស្ងប់ស្ងាត់មួយ មុននឹងចាប់ផ្តើមអបអរបុណ្យផ្សេងទៀត។",
      contributor: "ម្តាយខ្ញុំ",
      place: "ផ្ទះជីដូនជីតារបស់ខ្ញុំ ខេត្តកណ្តាល",
    },
    entry2: {
      title: "មីឆាថ្លា",
      description:
        "ជាមុខម្ហូបមីឆាថ្លាជាមួយសំបកទឹកសណ្តែកបំពង ផ្សិតត្រចៀកឈើ ការ៉ុត និងខ្ទឹមបារាំង ដែលម្តាយខ្ញុំចម្អិនសម្រាប់តុបុណ្យចូលឆ្នាំថ្មីខ្មែររបស់ក្រុមគ្រួសារ។ មីច្រើនតែត្រូវបានបម្រើក្នុងអំឡុងពេលបុណ្យនេះ ជានិមិត្តរូបនៃការប្រាថ្នាឲ្យមានអាយុវែង ហើយម្ហូបនេះជាមុខម្ហូបមួយដែលក្រុមគ្រួសាររបស់ខ្ញុំតែងតែរង់ចាំរាល់ឆ្នាំ។",
      contributor: "ម្តាយខ្ញុំ",
      place: "ផ្ទះជីដូនជីតារបស់ខ្ញុំ ខេត្តកណ្តាល",
    },
    entry3: {
      title: "ការសាងសង់ភ្នំខ្សាច់",
      description:
        "នៅថ្ងៃទី២នៃពិធីបុណ្យចូលឆ្នាំថ្មី គ្រួសារនិងពុទ្ធបរិស័ទនាំគ្នាកន្សួសខ្សាច់ជាគំនរតូចៗឲ្យទៅជារាងភ្នំ ដែលតំណាងឲ្យភ្នំព្រះសុមេរុ រួចតុបតែងវាដោយផ្កា ទៀន និងទង់ជាតិ។ គ្រាប់ខ្សាច់នីមួយៗដែលដាក់ចុះ ត្រូវបានចាត់ទុកជាទង្វើតូចមួយនៃការជម្រុះកម្មសម្រាប់ឆ្នាំខាងមុខ។",
      contributor: "ក្រុមគ្រួសាររបស់ខ្ញុំ",
      place: "ខេត្តកណ្តាល",
    },
    entry4: {
      title: "ពិធីស្រង់ព្រះ",
      description:
        "នៅថ្ងៃទី៣ ដែលជាថ្ងៃចុងក្រោយនៃពិធីបុណ្យចូលឆ្នាំថ្មី ទឹកអប់ត្រូវបានប្រើសម្រាប់ស្រង់ព្រះពុទ្ធរូប និងចាស់ទុំ ជាទង្វើមួយដែលគេជឿថាអាចលាងជម្រះទុក្ខព្រួយ ភាពសោកសៅ និងសំណាងអាក្រក់ពីឆ្នាំមុន ព្រមទាំងនាំមកនូវពរជ័យ និងសេចក្តីរុងរឿងសម្រាប់ឆ្នាំខាងមុខ។ សមាជិកគ្រួសារជំនាន់ក្រោយច្រើនតែស្រោចទឹកលើដៃជីដូនជីតា និងចាស់ទុំ ជាកាយវិការនៃការគោរព។",
      contributor: "ក្រុមគ្រួសាររបស់ខ្ញុំ",
      place: "ខេត្តកណ្តាល",
    },
    entry5: {
      title: "ចោលចាំង",
      description:
        "ល្បែងចោលចាំងត្រូវបានលេងជាពិសេសនៅយប់ដំបូងនៃពិធីបុណ្យចូលឆ្នាំថ្មីខ្មែរ ដោយបែងចែកយុវជនប្រុសស្រីជាពីរក្រុមងាកមុខចូលគ្នា ហើយបោះក្រមាចងជាកណ្តាប់ទៅវិញទៅមក។ ក្រុមនីមួយៗច្រៀង និងរាំក្នុងពេលបោះនិងទទួលក្រមា ហើយប្រសិនបើនរណាម្នាក់ត្រូវក្រមាទាត់ត្រូវ ក្រុមទាំងមូលរបស់អ្នកនោះត្រូវរាំ ខណៈក្រុមម្ខាងទៀតច្រៀង។",
      contributor: "ក្រុមគ្រួសាររបស់ខ្ញុំ",
      place: "ខេត្តកណ្តាល",
    },
    entry6: {
      title: "លាក់កន្សែង",
      description:
        "ជាល្បែងរង្វង់សម្រាប់កុមារ និងក្មេងជំទង់ ដោយអ្នកលេងម្នាក់ដើរជុំវិញរង្វង់អ្នកលេងផ្សេងទៀតដែលអង្គុយ ដៃកាន់ក្រមាចងជាកួច ព្រមទាំងច្រៀងទៅតាមផ្លូវ ហើយលាក់ក្រមានោះដោយស្ងាត់ៗនៅពីក្រោយខ្នងនរណាម្នាក់ដោយមិនឲ្យដឹងខ្លួន។ ប្រសិនបើអ្នកលេងដែលត្រូវបានលាក់ក្រមាមិនដឹងខ្លួនទាន់ពេល គាត់ត្រូវរត់ដេញអ្នកលាក់ជុំវិញរង្វង់។",
      contributor: "ក្រុមគ្រួសាររបស់ខ្ញុំ",
      place: "ខេត្តកណ្តាល",
    },
    entry7: {
      title: "ក្រឡាន",
      description:
        "ជាល្បាយអង្ករចំណីដែលលាយឡំដោយសណ្តែកខ្ចី ទឹកដូង និងសំបកដូងកិន បំពេញចូលទៅក្នុងបំពង់ឫស្សី រួចដុតលើភ្លើងអស់រយៈពេលប្រមាណ៩០នាទី រហូតដល់អង្ករមានក្លិនក្រអូបផ្សែង និងលឿងសង្ហែមបន្តិច។ វាជាមុខទំនិញឆ្ងាញ់ដ៏ល្បីមួយក្នុងចំណោមម្ហូបនៃពិធីបុណ្យនេះ ដែលច្រើនតែលក់តាមផ្លូវក្នុងថ្ងៃមុននឹងដល់ចូលឆ្នាំថ្មី។",
      contributor: "ក្រុមគ្រួសាររបស់ខ្ញុំ",
      place: "ខេត្តកណ្តាល",
    },
    entry8: {
      title: "នំអន្សមចេក",
      description:
        "ជានំអង្ករចំណីរាងបំពង់ ដែលរុំដោយស្លឹកចេក ហើយម្ជុលចេកសម្រាប់ភ្លក្សរស់ជាតិផ្អែម រួចចំហុយរហូតទទឹងទន់។ វាជាបង្អែមមួយដែលទាក់ទងយ៉ាងជិតស្និទ្ធជាមួយទាំងពិធីបុណ្យចូលឆ្នាំថ្មី និងបុណ្យភ្ជុំបិណ្ឌ ហើយច្រើនតែធ្វើជាបាច់ៗច្រើន ដើម្បីឲ្យសមាជិកគ្រួសារយកទៅផ្ទះក្រោយពេលមកលេង។",
      contributor: "ក្រុមគ្រួសាររបស់ខ្ញុំ",
      place: "ខេត្តកណ្តាល",
    },
    ui: {
      nav_home: "ទំព័រដើម",
      nav_entries: "ធាតុទាំងអស់",
      search_placeholder: "ស្វែងរកតាមចំណងជើង ខ្លឹមសារ ឬពាក្យគន្លឹះ ជាភាសាខ្មែរ ឬអង់គ្លេស",
      no_results: "រកមិនឃើញធាតុណាដែលត្រូវនឹងការស្វែងរករបស់អ្នកទេ។",
      back_to_entries: "ត្រឡប់ទៅធាតុទាំងអស់",
      curated_by: "រៀបចំដោយ",
      source_label: "ប្រភព",
      contributor_label: "អ្នករួមចំណែក",
      place_label: "ទីកន្លែង",
      entries_count_prefix: "ធាតុនៅក្នុងបណ្ណសារ:",
      entries_count_suffix: "(សម្រាប់ពេលនេះ)",
      hero_kicker: "បណ្ណសារជីវិតខ្មែរ",
      cta_button: "ស្វែងយល់បណ្ណសារ",
      archive_name: "សូរស័ព្ទឆ្នាំថ្មីខ្មែរ",
      curator_name: "ឈាវ គឹមហេង",
      archive_description:
        "កំណត់ត្រានៃទំនៀមទម្លាប់ ពិធីសាសនា និងម្ហូបអាហារនៃពិធីបុណ្យចូលឆ្នាំថ្មីខ្មែរ ដែលក្រុមគ្រួសាររបស់ខ្ញុំបន្តរក្សារាល់ឆ្នាំនៅផ្ទះជីដូនជីតារបស់ខ្ញុំ។",
      archive_source:
        "ផ្តល់ដោយម្តាយខ្ញុំ ដែលបានរក្សាទំនៀមទម្លាប់បុណ្យចូលឆ្នាំថ្មីខ្មែររបស់ក្រុមគ្រួសារយើងឲ្យនៅតែមានជីវិត ហើយចងចាំប្រវត្តិនៃទាំងពិធីសាសនា និងម្ហូបអាហារ។",
      footer_credit:
        "សាងសង់ក្នុងមុខវិជ្ជា ICT 340 — Vibe Coding នៅសាកលវិទ្យាល័យ American University of Phnom Penh រដូវស្លឹកឈើជ្រុះ ២០២៦។ បណ្ណសារនេះកំពុងសាងសង់អស់មួយឆមាស។ សូមចូលមកទស្សនាម្តងទៀតនៅខែធ្នូ។",
      landing_intro: [
        "ចូលឆ្នាំថ្មី — ឆ្នាំថ្មីខ្មែរ — មកដល់រៀងរាល់ខែមេសា ត្រូវនឹងចុងរដូវប្រមូលផល និងចាក់ឫសជាមួយប្រពៃណីព្រះពុទ្ធសាសនាថេរវាទជាច្រើនសតវត្សរ៍មកហើយ។ ក្នុងរយៈពេលបីថ្ងៃ ក្រុមគ្រួសារនានាទទួលទេវតារក្សាថ្មី ទៅវត្តដើម្បីធ្វើបុណ្យថ្វាយសង្ឃទាន និងជួបជុំគ្នាដើម្បីលាងជម្រះសំណាងអាក្រក់នៃឆ្នាំមុនតាមរយៈទឹកអប់ដែលស្រោចលើព្រះពុទ្ធរូប និងចាស់ទុំ។",
        "បណ្ណសារនេះផ្ទុកនូវទម្រង់នៃចង្វាក់នោះរបស់គ្រួសារមួយ៖ តុបូជាដែលម្តាយខ្ញុំរៀបចំរាល់ឆ្នាំ មីដែលនាងចម្អិនសម្រាប់សំណាងល្អ ល្បែងលេងនៅយប់ដំបូង ចម្រៀងដែលបន្តពីជំនាន់មួយទៅជំនាន់មួយ។ គ្មានអ្វីមួយក្នុងនេះមកពីសៀវភៅសិក្សាទេ — វាមកពីការមើល ការជួយ និងការសួរសំណួរតាមរយៈរសៀលខែមេសាជាច្រើន។",
      ],
    },
  },
};

export default translations;